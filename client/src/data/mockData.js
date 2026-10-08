export const mockPlans = [
  {
    _id: 'plan_free',
    name: 'Free',
    slug: 'free',
    description: 'Perfect for exploring Payora.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'INR',
    features: [
      'Basic subscription management',
      'Payment history',
      'Basic billing history',
      'Email support'
    ],
    isActive: true,
    isPopular: false
  },
  {
    _id: 'plan_pro',
    name: 'Pro',
    slug: 'pro',
    description: 'For growing businesses that need more control.',
    monthlyPrice: 299,
    yearlyPrice: 2999,
    currency: 'INR',
    features: [
      'Unlimited subscriptions',
      'Recurring payments',
      'Advanced billing',
      'Transaction history',
      'Invoice management',
      'Priority support'
    ],
    isActive: true,
    isPopular: true
  },
  {
    _id: 'plan_premium',
    name: 'Premium',
    slug: 'premium',
    description: 'Advanced billing for serious businesses.',
    monthlyPrice: 799,
    yearlyPrice: 7999,
    currency: 'INR',
    features: [
      'Everything in Pro',
      'Advanced analytics',
      'Refund management',
      'Priority support',
      'Advanced subscription controls',
      'Admin reporting'
    ],
    isActive: true,
    isPopular: false
  }
];

export const mockUser = {
  id: 'user_001',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  role: 'user',
  isActive: true
};

export const mockSubscription = {
  id: 'sub_demo_8K29X',
  plan: 'Pro',
  planId: 'plan_pro',
  billingCycle: 'monthly',
  amount: 299,
  currency: 'INR',
  status: 'active',
  method: 'UPI',
  startAt: '2026-09-15T10:00:00Z',
  nextBillingAt: '2026-10-15T10:00:00Z',
  endAt: '2027-10-15T10:00:00Z'
};

export const mockTransactions = [
  { id: 'TXN-2026-00129', paymentId: 'pay_demo_001', user: 'Rahul Sharma', plan: 'PRO', billingCycle: 'Monthly', amount: 299, currency: 'INR', method: 'UPI', status: 'Paid', date: '2026-09-15T10:30:00Z', invoiceId: 'PAY-2026-000001' },
  { id: 'TXN-2026-00130', paymentId: 'pay_demo_002', user: 'Rahul Sharma', plan: 'PRO', billingCycle: 'Monthly', amount: 299, currency: 'INR', method: 'Card', status: 'Paid', date: '2026-08-15T14:45:00Z', invoiceId: 'PAY-2026-000002' },
  { id: 'TXN-2026-00131', paymentId: 'pay_demo_003', user: 'Amit Patel', plan: 'PREMIUM', billingCycle: 'Yearly', amount: 7999, currency: 'INR', method: 'NetBanking', status: 'Pending', date: '2026-09-18T09:15:00Z', invoiceId: null },
  { id: 'TXN-2026-00132', paymentId: 'pay_demo_004', user: 'Neha Shah', plan: 'PRO', billingCycle: 'Monthly', amount: 299, currency: 'INR', method: 'Card', status: 'Failed', date: '2026-09-20T16:20:00Z', invoiceId: null },
  { id: 'TXN-2026-00133', paymentId: 'pay_demo_005', user: 'Karan Mehta', plan: 'PREMIUM', billingCycle: 'Monthly', amount: 799, currency: 'INR', method: 'UPI', status: 'Partially Refunded', date: '2026-09-22T11:10:00Z', invoiceId: 'PAY-2026-000003' },
  { id: 'TXN-2026-00134', paymentId: 'pay_demo_006', user: 'Priya Desai', plan: 'PRO', billingCycle: 'Yearly', amount: 2999, currency: 'INR', method: 'Card', status: 'Refunded', date: '2026-09-25T13:40:00Z', invoiceId: 'PAY-2026-000004' },
  { id: 'TXN-2026-00135', paymentId: 'pay_demo_007', user: 'Rahul Sharma', plan: 'PRO', billingCycle: 'Monthly', amount: 299, currency: 'INR', method: 'UPI', status: 'Paid', date: '2026-07-15T10:00:00Z', invoiceId: 'PAY-2026-000005' },
  { id: 'TXN-2026-00136', paymentId: 'pay_demo_008', user: 'Rahul Sharma', plan: 'PRO', billingCycle: 'Monthly', amount: 299, currency: 'INR', method: 'Card', status: 'Paid', date: '2026-06-15T10:00:00Z', invoiceId: 'PAY-2026-000006' },
  { id: 'TXN-2026-00137', paymentId: 'pay_demo_009', user: 'Rahul Sharma', plan: 'PRO', billingCycle: 'Monthly', amount: 299, currency: 'INR', method: 'UPI', status: 'Paid', date: '2026-05-15T10:00:00Z', invoiceId: 'PAY-2026-000007' },
  { id: 'TXN-2026-00138', paymentId: 'pay_demo_010', user: 'Amit Patel', plan: 'PREMIUM', billingCycle: 'Monthly', amount: 799, currency: 'INR', method: 'UPI', status: 'Paid', date: '2026-09-10T10:00:00Z', invoiceId: 'PAY-2026-000008' }
];

export const mockAdminTransactions = [...mockTransactions];

export const mockInvoices = [
  { id: 'PAY-2026-000001', customerName: 'Rahul Sharma', customerEmail: 'rahul.sharma@example.com', plan: 'PRO', billingCycle: 'Monthly', amount: 299, tax: 0, total: 299, status: 'Paid', date: '2026-09-15T10:30:00Z', transactionId: 'TXN-2026-00129', paymentId: 'pay_demo_001', method: 'UPI' },
  { id: 'PAY-2026-000002', customerName: 'Rahul Sharma', customerEmail: 'rahul.sharma@example.com', plan: 'PRO', billingCycle: 'Monthly', amount: 299, tax: 0, total: 299, status: 'Paid', date: '2026-08-15T14:45:00Z', transactionId: 'TXN-2026-00130', paymentId: 'pay_demo_002', method: 'Card' },
  { id: 'PAY-2026-000003', customerName: 'Karan Mehta', customerEmail: 'karan@example.com', plan: 'PREMIUM', billingCycle: 'Monthly', amount: 799, tax: 0, total: 799, status: 'Paid', date: '2026-09-22T11:10:00Z', transactionId: 'TXN-2026-00133', paymentId: 'pay_demo_005', method: 'UPI' },
  { id: 'PAY-2026-000004', customerName: 'Priya Desai', customerEmail: 'priya@example.com', plan: 'PRO', billingCycle: 'Yearly', amount: 2999, tax: 0, total: 2999, status: 'Refunded', date: '2026-09-25T13:40:00Z', transactionId: 'TXN-2026-00134', paymentId: 'pay_demo_006', method: 'Card' },
  { id: 'PAY-2026-000005', customerName: 'Rahul Sharma', customerEmail: 'rahul.sharma@example.com', plan: 'PRO', billingCycle: 'Monthly', amount: 299, tax: 0, total: 299, status: 'Paid', date: '2026-07-15T10:00:00Z', transactionId: 'TXN-2026-00135', paymentId: 'pay_demo_007', method: 'UPI' },
  { id: 'PAY-2026-000006', customerName: 'Rahul Sharma', customerEmail: 'rahul.sharma@example.com', plan: 'PRO', billingCycle: 'Monthly', amount: 299, tax: 0, total: 299, status: 'Paid', date: '2026-06-15T10:00:00Z', transactionId: 'TXN-2026-00136', paymentId: 'pay_demo_008', method: 'Card' },
  { id: 'PAY-2026-000007', customerName: 'Rahul Sharma', customerEmail: 'rahul.sharma@example.com', plan: 'PRO', billingCycle: 'Monthly', amount: 299, tax: 0, total: 299, status: 'Paid', date: '2026-05-15T10:00:00Z', transactionId: 'TXN-2026-00137', paymentId: 'pay_demo_009', method: 'UPI' },
  { id: 'PAY-2026-000008', customerName: 'Amit Patel', customerEmail: 'amit@example.com', plan: 'PREMIUM', billingCycle: 'Monthly', amount: 799, tax: 0, total: 799, status: 'Paid', date: '2026-09-10T10:00:00Z', transactionId: 'TXN-2026-00138', paymentId: 'pay_demo_010', method: 'UPI' }
];

export const mockRefunds = [
  { id: 'rfnd_demo_001', transactionId: 'TXN-2026-00133', user: 'Karan Mehta', date: '2026-09-23T14:20:00Z', amount: 300, originalAmount: 799, reason: 'Customer requested', status: 'Partially Refunded' },
  { id: 'rfnd_demo_002', transactionId: 'TXN-2026-00134', user: 'Priya Desai', date: '2026-09-26T09:15:00Z', amount: 2999, originalAmount: 2999, reason: 'Service issue', status: 'Refunded' }
];

export const mockAdminRefunds = [...mockRefunds];

export const mockSubscriptionHistory = [
  { _id: 'sh_1', action: 'subscription_created', createdAt: '2026-09-15T10:00:00Z', previousPlan: null, newPlan: { name: 'Pro' } },
  { _id: 'sh_2', action: 'subscription_activated', createdAt: '2026-09-15T10:05:00Z', previousPlan: null, newPlan: { name: 'Pro' } },
  { _id: 'sh_3', action: 'payment_charged', createdAt: '2026-09-15T10:05:00Z', amount: 299 },
  { _id: 'sh_4', action: 'billing_cycle_change', createdAt: '2026-10-10T10:00:00Z', previousPlan: { name: 'Pro' }, newPlan: { name: 'Pro' }, previousBillingCycle: 'monthly', newBillingCycle: 'yearly' },
  { _id: 'sh_5', action: 'upgrade', createdAt: '2026-11-15T10:00:00Z', previousPlan: { name: 'Pro' }, newPlan: { name: 'Premium' }, previousBillingCycle: 'yearly', newBillingCycle: 'yearly' }
];

export const mockUsers = [
  { id: 'user_001', name: 'Rahul Sharma', email: 'rahul.sharma@example.com', plan: 'PRO', status: 'Active', role: 'user' },
  { id: 'user_002', name: 'Amit Patel', email: 'amit@example.com', plan: 'PREMIUM', status: 'Active', role: 'user' },
  { id: 'user_003', name: 'Neha Shah', email: 'neha@example.com', plan: 'FREE', status: 'Active', role: 'user' },
  { id: 'user_004', name: 'Karan Mehta', email: 'karan@example.com', plan: 'PRO', status: 'Active', role: 'user' },
  { id: 'user_005', name: 'Priya Desai', email: 'priya@example.com', plan: 'PREMIUM', status: 'Active', role: 'user' },
  { id: 'user_006', name: 'Ravi Kumar', email: 'ravi@example.com', plan: 'PRO', status: 'Inactive', role: 'user' },
  { id: 'user_007', name: 'Sonal Singh', email: 'sonal@example.com', plan: 'FREE', status: 'Active', role: 'user' },
  { id: 'user_008', name: 'Vikram Joshi', email: 'vikram@example.com', plan: 'PRO', status: 'Active', role: 'admin' }
];

export const mockAdminSubscriptions = [
  { id: 'sub_demo_01', user: 'Rahul Sharma', plan: 'PRO', billingCycle: 'Monthly', status: 'Active', amount: 299, nextBillingAt: '2026-10-15T10:00:00Z' },
  { id: 'sub_demo_02', user: 'Amit Patel', plan: 'PREMIUM', billingCycle: 'Yearly', status: 'Active', amount: 7999, nextBillingAt: '2027-09-10T10:00:00Z' },
  { id: 'sub_demo_03', user: 'Neha Shah', plan: 'FREE', billingCycle: 'Monthly', status: 'Active', amount: 0, nextBillingAt: null },
  { id: 'sub_demo_04', user: 'Karan Mehta', plan: 'PRO', billingCycle: 'Monthly', status: 'Pending', amount: 299, nextBillingAt: '2026-10-22T10:00:00Z' },
  { id: 'sub_demo_05', user: 'Priya Desai', plan: 'PREMIUM', billingCycle: 'Yearly', status: 'Halted', amount: 7999, nextBillingAt: '2027-09-25T10:00:00Z' },
  { id: 'sub_demo_06', user: 'Ravi Kumar', plan: 'PRO', billingCycle: 'Monthly', status: 'Cancelled', amount: 299, nextBillingAt: null },
  { id: 'sub_demo_07', user: 'Sonal Singh', plan: 'FREE', billingCycle: 'Monthly', status: 'Active', amount: 0, nextBillingAt: null },
  { id: 'sub_demo_08', user: 'Vikram Joshi', plan: 'PRO', billingCycle: 'Yearly', status: 'Completed', amount: 2999, nextBillingAt: null },
  { id: 'sub_demo_09', user: 'Arjun Reddy', plan: 'PRO', billingCycle: 'Monthly', status: 'Active', amount: 299, nextBillingAt: '2026-10-28T10:00:00Z' },
  { id: 'sub_demo_10', user: 'Kavita Iyer', plan: 'PREMIUM', billingCycle: 'Monthly', status: 'Active', amount: 799, nextBillingAt: '2026-10-30T10:00:00Z' }
];

export const mockWebhookEvents = [
  { id: 'evt_demo_001', event: 'subscription.created', subscriptionId: 'sub_demo_8K29X', status: 'Processed', createdAt: '2026-09-15T09:55:00Z' },
  { id: 'evt_demo_002', event: 'subscription.authenticated', subscriptionId: 'sub_demo_8K29X', status: 'Processed', createdAt: '2026-09-15T09:58:00Z' },
  { id: 'evt_demo_003', event: 'subscription.activated', subscriptionId: 'sub_demo_8K29X', status: 'Processed', createdAt: '2026-09-15T10:00:00Z' },
  { id: 'evt_demo_004', event: 'subscription.charged', subscriptionId: 'sub_demo_8K29X', status: 'Processed', createdAt: '2026-09-15T10:05:00Z' },
  { id: 'evt_demo_005', event: 'subscription.pending', subscriptionId: 'sub_demo_9L30Y', status: 'Failed', createdAt: '2026-09-18T09:15:00Z' },
  { id: 'evt_demo_006', event: 'subscription.halted', subscriptionId: 'sub_demo_9L30Y', status: 'Processed', createdAt: '2026-09-18T10:15:00Z' },
  { id: 'evt_demo_007', event: 'subscription.cancelled', subscriptionId: 'sub_demo_0P21Q', status: 'Processed', createdAt: '2026-09-20T16:20:00Z' },
  { id: 'evt_demo_008', event: 'subscription.completed', subscriptionId: 'sub_demo_1X44Z', status: 'Processed', createdAt: '2026-09-25T13:40:00Z' }
];

export const mockNotifications = [
  { id: 'notif_1', text: 'Your PRO subscription has been activated.', date: '2026-09-15T10:00:00Z', read: true },
  { id: 'notif_2', text: 'Payment of ₹299 was successful.', date: '2026-09-15T10:05:00Z', read: true },
  { id: 'notif_3', text: 'Your next billing date is 15 October 2026.', date: '2026-09-16T10:00:00Z', read: false },
  { id: 'notif_4', text: 'Your invoice PAY-2026-000001 is ready.', date: '2026-09-16T10:05:00Z', read: false },
  { id: 'notif_5', text: 'Subscription plan changed successfully.', date: '2026-10-10T10:00:00Z', read: false }
];

export const mockDashboardStats = {
  currentPlan: 'PRO',
  subscriptionStatus: 'Active',
  nextBillingDate: '15 Oct 2026',
  totalPaid: 2990,
  activeSubscriptions: 1284,
  monthlyRevenue: 384500,
  successfulPayments: 1198,
  failedPayments: 52,
  refundedAmount: 48200
};

export const mockRevenueData = [
  { month: 'April', amount: 240000 },
  { month: 'May', amount: 265000 },
  { month: 'June', amount: 289000 },
  { month: 'July', amount: 310000 },
  { month: 'August', amount: 352000 },
  { month: 'September', amount: 384500 }
];

export const mockPlanDistribution = [
  { name: 'Free', value: 420 },
  { name: 'Pro', value: 680 },
  { name: 'Premium', value: 184 }
];
