import Subscription from '../models/Subscription.js';

export const getAdminSubscriptions = async (req, res) => {
  try {
    const { status, billingCycle } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (billingCycle) filter.billingCycle = billingCycle;

    const subscriptions = await Subscription.find(filter)
      .populate('user', 'name email')
      .populate('plan', 'name monthlyPrice yearlyPrice')
      .sort({ createdAt: -1 });

    // Exclude sensitive user data, only returning necessary info
    const formattedSubs = subscriptions.map(sub => ({
      id: sub._id,
      user: sub.user ? { name: sub.user.name, email: sub.user.email } : null,
      plan: sub.plan ? { name: sub.plan.name } : null,
      billingCycle: sub.billingCycle,
      amount: sub.amount,
      currency: sub.currency,
      status: sub.status,
      razorpaySubscriptionId: sub.razorpaySubscriptionId,
      startAt: sub.startAt,
      endAt: sub.endAt,
      nextBillingAt: sub.nextBillingAt,
      createdAt: sub.createdAt
    }));

    res.status(200).json({ success: true, data: formattedSubs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error.message] });
  }
};
