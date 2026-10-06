import crypto from 'crypto';
import WebhookEvent from '../models/WebhookEvent.js';
import Subscription from '../models/Subscription.js';
import Transaction from '../models/Transaction.js';

export const verifyWebhookSignature = (rawBody, signature) => {
  if (!signature) return false;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET is not defined');

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody.toString())
    .digest('hex');
  
  return expectedSignature === signature;
};

export const processWebhookEvent = async (payload, rawEventId) => {
  const eventName = payload.event;
  const eventId = rawEventId || payload.account_id + '_' + Date.now(); // fallback if header missing but usually in header x-razorpay-event-id

  // 1. Idempotency Check
  const existingEvent = await WebhookEvent.findOne({ eventId });
  if (existingEvent) {
    if (existingEvent.processed) {
      return { success: true, message: 'Event already processed' };
    }
  } else {
    // Create new event record
    await WebhookEvent.create({
      eventId,
      event: eventName,
      razorpaySubscriptionId: payload.payload?.subscription?.entity?.id
    });
  }

  try {
    let resultMessage = 'Event ignored';

    // 2. Handle Subscription Events
    if (eventName.startsWith('subscription.')) {
      const subscriptionEntity = payload.payload.subscription.entity;
      const rzpSubId = subscriptionEntity.id;

      const subscription = await Subscription.findOne({ razorpaySubscriptionId: rzpSubId });
      
      if (!subscription) {
        throw new Error(`Subscription not found for ID: ${rzpSubId}`);
      }

      // Map status
      const statusMap = {
        'created': 'created',
        'authenticated': 'authenticated',
        'activated': 'active',
        'active': 'active',
        'charged': 'active',
        'pending': 'pending',
        'halted': 'halted',
        'cancelled': 'cancelled',
        'completed': 'completed',
        'expired': 'expired'
      };

      if (statusMap[subscriptionEntity.status]) {
        subscription.status = statusMap[subscriptionEntity.status];
      }

      // Update dates
      if (subscriptionEntity.start_at) subscription.startAt = new Date(subscriptionEntity.start_at * 1000);
      if (subscriptionEntity.end_at) subscription.endAt = new Date(subscriptionEntity.end_at * 1000);
      if (subscriptionEntity.charge_at) subscription.nextBillingAt = new Date(subscriptionEntity.charge_at * 1000);

      await subscription.save();
      resultMessage = `Subscription updated to ${subscription.status}`;
    }

    // 3. Handle Payment/Charge Events
    if (eventName === 'subscription.charged') {
      const paymentEntity = payload.payload.payment.entity;
      const subscriptionEntity = payload.payload.subscription.entity;
      const rzpSubId = subscriptionEntity.id;
      const rzpPayId = paymentEntity.id;

      const subscription = await Subscription.findOne({ razorpaySubscriptionId: rzpSubId });
      
      if (subscription) {
        // Prevent duplicate transaction
        const existingTx = await Transaction.findOne({ razorpayPaymentId: rzpPayId });
        if (!existingTx) {
          await Transaction.create({
            user: subscription.user,
            subscription: subscription._id,
            plan: subscription.plan,
            razorpayPaymentId: rzpPayId,
            razorpaySubscriptionId: rzpSubId,
            amount: paymentEntity.amount / 100, // back to rupees
            currency: paymentEntity.currency,
            status: paymentEntity.status === 'captured' ? 'paid' : 'pending',
            method: paymentEntity.method,
            capturedAt: paymentEntity.captured_at ? new Date(paymentEntity.captured_at * 1000) : null,
            rawEventId: eventId
          });
          resultMessage += ` and Transaction created`;
        }
      }
    }

    // Mark as processed
    await WebhookEvent.findOneAndUpdate(
      { eventId },
      { processed: true, processingStatus: 'success', processedAt: new Date() }
    );

    return { success: true, message: resultMessage };

  } catch (error) {
    // Log error but don't throw, we want to acknowledge the webhook to Razorpay
    await WebhookEvent.findOneAndUpdate(
      { eventId },
      { processingStatus: 'error', errorMessage: error.message }
    );
    console.error(`Webhook Error for event ${eventId}:`, error.message);
    return { success: true, message: 'Event logged with error' };
  }
};
