import Plan from '../models/Plan.js';
import Subscription from '../models/Subscription.js';
import * as razorpayService from '../services/razorpay.service.js';

export const createSubscription = async (req, res) => {
  try {
    const { planId, billingCycle } = req.body;

    if (!planId || !billingCycle) {
      return res.status(400).json({ success: false, message: 'Missing fields', errors: ['planId and billingCycle are required'] });
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

    // Total count for recurring billing - assuming 12 for monthly, 1 for yearly (or just let Razorpay default)
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
    // Get the most recent active or created subscription for the user
    const subscription = await Subscription.findOne({ user: req.user.id })
      .populate('plan')
      .sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(200).json({ success: true, data: null });
    }

    res.status(200).json({
      success: true,
      data: {
        plan: subscription.plan?.name || 'Unknown',
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
