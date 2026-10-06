import { verifyWebhookSignature, processWebhookEvent } from '../services/razorpayWebhook.service.js';

export const handleRazorpayWebhook = async (req, res) => {
  try {
    const rawBody = req.body; // Buffer from express.raw()
    const signature = req.headers['x-razorpay-signature'];
    const eventId = req.headers['x-razorpay-event-id'];

    if (!verifyWebhookSignature(rawBody, signature)) {
      console.warn('Webhook signature verification failed');
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    // Safe to parse JSON now
    const payload = JSON.parse(rawBody.toString());

    // Process event
    const result = await processWebhookEvent(payload, eventId);

    // Always return 200 OK to acknowledge receipt if signature is valid
    res.status(200).json(result);
  } catch (error) {
    console.error('Webhook Controller Error:', error);
    // Don't crash the server, just return 400 for bad payloads
    res.status(400).json({ success: false, message: 'Webhook processing failed' });
  }
};
