import { getRazorpay } from '../config/razorpay.js';

export const createPlan = async ({ name, amount, period }) => {
  const rzp = getRazorpay();
  
  // Amount must be in paise for INR
  const planPayload = {
    period: period, // "monthly" or "yearly"
    interval: 1,
    item: {
      name: `Payora ${name} - ${period}`,
      amount: amount * 100, // convert to paise
      currency: 'INR',
      description: `${name} Plan - ${period} billing`
    }
  };

  const razorpayPlan = await rzp.plans.create(planPayload);
  return razorpayPlan;
};

export const createSubscription = async ({ planId, totalCount = 12 }) => {
  const rzp = getRazorpay();

  const subPayload = {
    plan_id: planId,
    customer_notify: 1,
    total_count: totalCount,
  };

  const subscription = await rzp.subscriptions.create(subPayload);
  return subscription;
};

export const cancelSubscription = async (subscriptionId, cancelAtCycleEnd = true) => {
  const rzp = getRazorpay();
  const subscription = await rzp.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);
  return subscription;
};

export const updateSubscription = async (subscriptionId, { planId }) => {
  const rzp = getRazorpay();
  const payload = {
    plan_id: planId,
    customer_notify: 1
  };
  const subscription = await rzp.subscriptions.update(subscriptionId, payload);
  return subscription;
};
