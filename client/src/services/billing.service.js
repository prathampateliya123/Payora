import { 
  mockTransactions, 
  mockAdminTransactions, 
  mockInvoices, 
  mockRefunds, 
  mockAdminRefunds 
} from '../data/mockData';

// TODO: Replace mock data with API response

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getTransactions = async () => {
  await delay(800);
  return { success: true, data: mockTransactions };
};

export const getTransactionById = async (id) => {
  await delay(500);
  const txn = mockTransactions.find(t => t.id === id) || mockAdminTransactions.find(t => t.id === id);
  if (!txn) throw new Error('Transaction not found');
  
  const refund = mockRefunds.find(r => r.transactionId === id) || mockAdminRefunds.find(r => r.transactionId === id);
  return { success: true, data: { ...txn, refund } };
};

export const getInvoices = async () => {
  await delay(800);
  return { success: true, data: mockInvoices };
};

export const getInvoiceById = async (id) => {
  await delay(500);
  const inv = mockInvoices.find(i => i.id === id);
  if (!inv) throw new Error('Invoice not found');
  return { success: true, data: inv };
};

export const getAdminTransactions = async () => {
  await delay(800);
  return { success: true, data: mockAdminTransactions };
};

export const getAdminTransactionById = async (id) => {
  await delay(500);
  return getTransactionById(id);
};

export const getAdminRefunds = async () => {
  await delay(800);
  return { success: true, data: mockAdminRefunds };
};

export const refundTransaction = async (id, data) => {
  await delay(1200);
  return { success: true, message: 'Refund initiated successfully', data: { id: 'ref_mock123', amount: data.amount } };
};
