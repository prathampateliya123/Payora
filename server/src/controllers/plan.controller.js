import Plan from '../models/Plan.js';
import * as razorpayService from '../services/razorpay.service.js';

export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', errors: [error.message] });
  }
};

export const createRazorpayPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { period } = req.body; // 'monthly' or 'yearly'
    
    if (!period || (period !== 'monthly' && period !== 'yearly')) {
      return res.status(400).json({ success: false, message: 'Invalid period', errors: ['Period must be monthly or yearly'] });
    }

    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found', errors: ['Plan does not exist in DB'] });
    }

    if (!plan.isActive) {
      return res.status(400).json({ success: false, message: 'Plan inactive', errors: ['Cannot create Razorpay plan for inactive plan'] });
    }

    if (plan.name === 'FREE') {
      return res.status(400).json({ success: false, message: 'Cannot create Razorpay plan for FREE plan', errors: [] });
    }

    // Usually, you might store both monthly and yearly Razorpay Plan IDs in DB, but the prompt just says razorpayPlanId.
    // If the schema only has one razorpayPlanId, we can only map one period per DB Plan. 
    // To support both, the schema should ideally have `razorpayMonthlyPlanId` and `razorpayYearlyPlanId`. 
    // Wait, the prompt says "Update the Plan model to optionally include: razorpayPlanId".
    // I will use razorpayPlanId for simplicity or assume we only create one right now per DB doc, OR since I can update the DB plan, I will just create it if it's missing.
    if (plan.razorpayPlanId) {
       return res.status(400).json({ success: false, message: 'Razorpay Plan already exists for this plan', errors: [] });
    }

    const amount = period === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

    const rzpPlan = await razorpayService.createPlan({
      name: plan.name,
      amount,
      period
    });

    plan.razorpayPlanId = rzpPlan.id;
    await plan.save();

    res.status(201).json({
      success: true,
      message: 'Razorpay plan created successfully',
      data: {
        plan,
        razorpayPlan: rzpPlan
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create Razorpay plan', errors: [error.message] });
  }
};
