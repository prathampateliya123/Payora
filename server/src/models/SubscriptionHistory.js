import mongoose from 'mongoose';

const subscriptionHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true
  },
  previousPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  newPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  previousBillingCycle: String,
  newBillingCycle: String,
  previousAmount: Number,
  newAmount: Number,
  action: {
    type: String,
    enum: ['upgrade', 'downgrade', 'billing_cycle_change', 'cancellation_requested', 'cancellation_completed'],
    required: true
  },
  effectiveAt: Date,
  razorpaySubscriptionId: String,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export default mongoose.model('SubscriptionHistory', subscriptionHistorySchema);
