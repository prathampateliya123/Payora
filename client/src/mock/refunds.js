export const mockRefunds = [
  {
    id: 'ref_3H70VmYpP11J',
    transactionId: 'TXN-2026-000133',
    paymentId: 'pay_3H70VmYpP11J',
    date: '2026-09-23T14:20:00Z',
    amount: 300,
    originalAmount: 799,
    reason: 'Customer requested downgrade',
    status: 'Processed'
  },
  {
    id: 'ref_2G60UlXoP00I',
    transactionId: 'TXN-2026-000134',
    paymentId: 'pay_2G60UlXoP00I',
    date: '2026-09-26T09:15:00Z',
    amount: 2999,
    originalAmount: 2999,
    reason: 'Accidental charge',
    status: 'Processed'
  }
];

export const mockAdminRefunds = [
  ...mockRefunds,
  {
    id: 'ref_9X87YmZpA22B',
    transactionId: 'TXN-2026-000138',
    paymentId: 'pay_9X87YmZpA22B',
    user: 'Alice Smith',
    date: '2026-09-28T11:00:00Z',
    amount: 500,
    originalAmount: 799,
    reason: 'Service issue',
    status: 'Pending'
  }
];
