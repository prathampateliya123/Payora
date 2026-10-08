export const mockTransactions = [
  {
    id: 'TXN-2026-000129',
    paymentId: 'pay_8K92XmQyT29X',
    date: '2026-09-15T10:30:00Z',
    plan: 'PRO',
    billingCycle: 'Monthly',
    amount: 299,
    method: 'UPI',
    status: 'Paid',
    invoiceId: 'PAY-2026-000001'
  },
  {
    id: 'TXN-2026-000130',
    paymentId: 'pay_7D31ZpTwP14L',
    date: '2026-09-16T14:45:00Z',
    plan: 'PRO',
    billingCycle: 'Monthly',
    amount: 299,
    method: 'Card',
    status: 'Paid',
    invoiceId: 'PAY-2026-000002'
  },
  {
    id: 'TXN-2026-000131',
    paymentId: 'pay_9L42YkRzT30M',
    date: '2026-09-18T09:15:00Z',
    plan: 'PREMIUM',
    billingCycle: 'Yearly',
    amount: 7999,
    method: 'NetBanking',
    status: 'Pending',
    invoiceId: null
  },
  {
    id: 'TXN-2026-000132',
    paymentId: 'pay_5J81WnXqP22K',
    date: '2026-09-20T16:20:00Z',
    plan: 'PRO',
    billingCycle: 'Monthly',
    amount: 299,
    method: 'Card',
    status: 'Failed',
    invoiceId: null
  },
  {
    id: 'TXN-2026-000133',
    paymentId: 'pay_3H70VmYpP11J',
    date: '2026-09-22T11:10:00Z',
    plan: 'PREMIUM',
    billingCycle: 'Monthly',
    amount: 799,
    method: 'UPI',
    status: 'Partially Refunded',
    invoiceId: 'PAY-2026-000003'
  },
  {
    id: 'TXN-2026-000134',
    paymentId: 'pay_2G60UlXoP00I',
    date: '2026-09-25T13:40:00Z',
    plan: 'PRO',
    billingCycle: 'Yearly',
    amount: 2999,
    method: 'Card',
    status: 'Refunded',
    invoiceId: 'PAY-2026-000004'
  }
];

export const mockAdminTransactions = [
  ...mockTransactions,
  {
    id: 'TXN-2026-000135',
    paymentId: 'pay_1F50TkWnO99H',
    user: 'Alice Smith',
    email: 'alice@example.com',
    date: '2026-09-26T10:00:00Z',
    plan: 'PRO',
    billingCycle: 'Monthly',
    amount: 299,
    method: 'UPI',
    status: 'Paid'
  },
  {
    id: 'TXN-2026-000136',
    paymentId: 'pay_0E40SjVmN88G',
    user: 'Bob Johnson',
    email: 'bob@example.com',
    date: '2026-09-27T15:30:00Z',
    plan: 'PREMIUM',
    billingCycle: 'Yearly',
    amount: 7999,
    method: 'Card',
    status: 'Paid'
  }
];
