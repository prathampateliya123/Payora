import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  razorpaySubscriptionId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPlanId: {
    type: String,
    required: true
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['created', 'authenticated', 'active', 'pending', 'halted', 'cancelled', 'completed', 'expired'],
    default: 'created'
  },
  startAt: { type: Date },
  endAt: { type: Date },
  nextBillingAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);
