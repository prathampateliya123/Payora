import mongoose from 'mongoose';

const webhookEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true
  },
  event: {
    type: String,
    required: true
  },
  razorpaySubscriptionId: {
    type: String
  },
  processed: {
    type: Boolean,
    default: false
  },
  processingStatus: {
    type: String,
    enum: ['success', 'error', 'ignored'],
  },
  errorMessage: {
    type: String
  },
  processedAt: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.model('WebhookEvent', webhookEventSchema);
