import Plan from '../models/Plan.js';
import Subscription from '../models/Subscription.js';
import SubscriptionHistory from '../models/SubscriptionHistory.js';
import * as razorpayService from '../services/razorpay.service.js';

export const createSubscription = async (req, res) => {
  try {
    const { planId, billingCycle } = req.body;

    if (!planId || !billingCycle) {
      return res.status(400).json({ success: false, message: 'Missing fields', errors: ['planId and billingCycle are required'] });
    }

    // Check for existing active subscription
    const existingSub = await Subscription.findOne({ 
      user: req.user.id, 
      status: { $in: ['active', 'authenticated', 'pending'] } 
    });
    if (existingSub) {
      return res.status(400).json({ success: false, message: 'You already have an active subscription. Please upgrade or cancel it instead.', errors: [] });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found', errors: [] });
    }

    if (!plan.isActive) {
      return res.status(400).json({ success: false, message: 'Plan is not active', errors: [] });
    }

    if (plan.name === 'FREE') {
      return res.status(400).json({ success: false, message: 'Cannot create Razorpay subscription for FREE plan', errors: [] });
    }

    if (!plan.razorpayPlanId) {
      return res.status(400).json({ success: false, message: 'Razorpay Plan ID not configured for this plan', errors: [] });
    }

    const totalCount = billingCycle === 'monthly' ? 12 : 5;

    const rzpSubscription = await razorpayService.createSubscription({
      planId: plan.razorpayPlanId,
      totalCount
    });

    const amount = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

    const newSubscription = await Subscription.create({
      user: req.user.id,
      plan: plan._id,
      razorpaySubscriptionId: rzpSubscription.id,
      razorpayPlanId: plan.razorpayPlanId,
      billingCycle,
      amount,
      status: 'created'
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created',
      data: {
        subscriptionId: rzpSubscription.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        planName: plan.name,
        billingCycle
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Subscription creation failed', errors: [error.message] });
  }
};

export const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id })
      .populate('plan')
      .sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(200).json({ success: true, data: null });
    }

    res.status(200).json({
      success: true,
      data: {
        id: subscription._id,
        plan: subscription.plan?.name || 'Unknown',
        planId: subscription.plan?._id,
        billingCycle: subscription.billingCycle,
        status: subscription.status,
        amount: subscription.amount,
        currency: subscription.currency,
        nextBillingAt: subscription.nextBillingAt || subscription.endAt || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error.message] });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    if (!subscriptionId) {
      return res.status(400).json({ success: false, message: 'Subscription ID is required', errors: [] });
    }

    const subscription = await Subscription.findById(subscriptionId).populate('plan');
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found', errors: [] });
    }

    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to modify this subscription', errors: [] });
    }

    if (['cancelled', 'completed', 'expired'].includes(subscription.status)) {
      return res.status(400).json({ success: false, message: `Subscription is already ${subscription.status}`, errors: [] });
    }

    // Cancel at end of cycle for active subscriptions
    const rzpResult = await razorpayService.cancelSubscription(subscription.razorpaySubscriptionId, true);

    await SubscriptionHistory.create({
      user: req.user.id,
      subscription: subscription._id,
      previousPlan: subscription.plan?._id,
      previousBillingCycle: subscription.billingCycle,
      previousAmount: subscription.amount,
      action: 'cancellation_requested',
      razorpaySubscriptionId: subscription.razorpaySubscriptionId
    });

    // Note: We don't mark as cancelled here. The webhook will handle final state change.
    res.status(200).json({
      success: true,
      message: 'Subscription cancellation requested successfully. It will be cancelled at the end of the current billing cycle.',
      data: rzpResult
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Cancellation failed', errors: [error.message] });
  }
};

export const changePlan = async (req, res) => {
  try {
    const { subscriptionId, newPlanId, billingCycle } = req.body;

    if (!subscriptionId || !newPlanId || !billingCycle) {
      return res.status(400).json({ success: false, message: 'Missing fields', errors: [] });
    }

    const subscription = await Subscription.findById(subscriptionId).populate('plan');
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found', errors: [] });
    }

    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to modify this subscription', errors: [] });
    }

    if (subscription.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Only active subscriptions can be changed', errors: [] });
    }

    const newPlan = await Plan.findById(newPlanId);
    if (!newPlan || !newPlan.isActive) {
      return res.status(404).json({ success: false, message: 'New plan not found or inactive', errors: [] });
    }

    if (newPlan.name === 'FREE') {
      return res.status(400).json({ success: false, message: 'Cannot downgrade to FREE using change plan. Please cancel your subscription instead.', errors: [] });
    }

    if (!newPlan.razorpayPlanId) {
      return res.status(400).json({ success: false, message: 'Razorpay plan not configured for the selected plan', errors: [] });
    }

    if (subscription.plan._id.toString() === newPlanId && subscription.billingCycle === billingCycle) {
      return res.status(400).json({ success: false, message: 'Subscription is already using this plan and billing cycle', errors: [] });
    }

    const newAmount = billingCycle === 'monthly' ? newPlan.monthlyPrice : newPlan.yearlyPrice;
    
    // Check if it's upgrade or downgrade based on price (simplification)
    const isUpgrade = newAmount > subscription.amount;
    const action = isUpgrade ? 'upgrade' : (newPlanId === subscription.plan._id.toString() ? 'billing_cycle_change' : 'downgrade');

    const rzpResult = await razorpayService.updateSubscription(subscription.razorpaySubscriptionId, {
      planId: newPlan.razorpayPlanId
    });

    await SubscriptionHistory.create({
      user: req.user.id,
      subscription: subscription._id,
      previousPlan: subscription.plan._id,
      newPlan: newPlan._id,
      previousBillingCycle: subscription.billingCycle,
      newBillingCycle: billingCycle,
      previousAmount: subscription.amount,
      newAmount: newAmount,
      action: action,
      razorpaySubscriptionId: subscription.razorpaySubscriptionId
    });

    res.status(200).json({
      success: true,
      message: 'Subscription plan change requested successfully.',
      data: rzpResult
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Plan change failed', errors: [error.message] });
  }
};

export const getSubscriptionHistory = async (req, res) => {
  try {
    const history = await SubscriptionHistory.find({ user: req.user.id })
      .populate('previousPlan')
      .populate('newPlan')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error.message] });
  }
};