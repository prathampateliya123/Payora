export const mockInvoices = [
  {
    id: 'PAY-2026-000001',
    date: '2026-09-15T10:30:00Z',
    description: 'PRO Monthly Subscription',
    amount: 299,
    status: 'Paid',
    transactionId: 'TXN-2026-000129',
    paymentId: 'pay_8K92XmQyT29X',
    method: 'UPI',
    plan: 'PRO',
    billingCycle: 'Monthly',
    customerName: 'John Doe',
    customerEmail: 'john@example.com'
  },
  {
    id: 'PAY-2026-000002',
    date: '2026-10-15T10:30:00Z',
    description: 'PRO Monthly Subscription',
    amount: 299,
    status: 'Paid',
    transactionId: 'TXN-2026-000130',
    paymentId: 'pay_7D31ZpTwP14L',
    method: 'Card',
    plan: 'PRO',
    billingCycle: 'Monthly',
    customerName: 'John Doe',
    customerEmail: 'john@example.com'
  },
  {
    id: 'PAY-2026-000003',
    date: '2026-09-22T11:10:00Z',
    description: 'PREMIUM Monthly Subscription',
    amount: 799,
    status: 'Paid', // Even if partially refunded, invoice itself was paid initially
    transactionId: 'TXN-2026-000133',
    paymentId: 'pay_3H70VmYpP11J',
    method: 'UPI',
    plan: 'PREMIUM',
    billingCycle: 'Monthly',
    customerName: 'John Doe',
    customerEmail: 'john@example.com'
  },
  {
    id: 'PAY-2026-000004',
    date: '2026-09-25T13:40:00Z',
    description: 'PRO Yearly Subscription',
    amount: 2999,
    status: 'Refunded',
    transactionId: 'TXN-2026-000134',
    paymentId: 'pay_2G60UlXoP00I',
    method: 'Card',
    plan: 'PRO',
    billingCycle: 'Yearly',
    customerName: 'John Doe',
    customerEmail: 'john@example.com'
  }
];
