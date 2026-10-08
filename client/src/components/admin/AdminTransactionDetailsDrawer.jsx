import { useState, useEffect } from 'react';
import { X, CheckCircle, Clock } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { getAdminTransactionById, refundTransaction } from '../../services/billing.service';

export const AdminTransactionDetailsDrawer = ({ transactionId, isOpen, onClose, onRefundSuccess }) => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refundStep, setRefundStep] = useState(0); // 0: No refund UI, 1: Details, 2: Confirm, 3: Success
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('Customer requested');
  const [refunding, setRefunding] = useState(false);

  useEffect(() => {
    if (isOpen && transactionId) {
      loadDetails();
      setRefundStep(0);
    }
  }, [isOpen, transactionId]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const res = await getAdminTransactionById(transactionId);
      setTransaction(res.data);
      if (res.data) setRefundAmount(res.data.amount.toString());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefundSubmit = async () => {
    setRefunding(true);
    try {
      await refundTransaction(transaction.id, {
        amount: Number(refundAmount),
        reason: refundReason
      });
      setRefundStep(3);
      onRefundSuccess();
      loadDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setRefunding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Transaction Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading || !transaction ? (
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Header info */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-2xl font-bold text-gray-900">₹{transaction.amount}</p>
                </div>
                <StatusBadge status={transaction.status} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">Transaction ID</dt>
                  <dd className="text-gray-900 font-mono mt-1">{transaction.id}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Payment ID</dt>
                  <dd className="text-gray-900 font-mono mt-1">{transaction.paymentId}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">User</dt>
                  <dd className="text-gray-900 mt-1">{transaction.user || 'Unknown'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="text-gray-900 mt-1">{transaction.email || 'user@example.com'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Plan</dt>
                  <dd className="text-gray-900 mt-1">{transaction.plan} ({transaction.billingCycle})</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Method</dt>
                  <dd className="text-gray-900 mt-1">{transaction.method}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Created At</dt>
                  <dd className="text-gray-900 mt-1">{new Date(transaction.date).toLocaleString('en-IN')}</dd>
                </div>
              </dl>
            </div>

            {/* Refund Section */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Refund Management</h3>
              
              {transaction.refund ? (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Original Amount</dt>
                    <dd className="text-gray-900">₹{transaction.refund.originalAmount}</dd>
                  </div>
                  <div className="flex justify-between font-medium">
                    <dt className="text-red-600">Refunded</dt>
                    <dd className="text-red-600">₹{transaction.refund.amount}</dd>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                    <dt className="text-gray-900">Remaining</dt>
                    <dd className="text-gray-900">₹{transaction.refund.originalAmount - transaction.refund.amount}</dd>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Reason: {transaction.refund.reason}
                  </div>
                </div>
              ) : (
                <>
                  {refundStep === 0 && (
                    <button 
                      onClick={() => setRefundStep(1)}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                    >
                      Refund Payment
                    </button>
                  )}

                  {refundStep === 1 && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 space-y-4">
                      <p className="text-sm font-medium text-red-800">Review the refund details before proceeding.</p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Refund Amount (Max ₹{transaction.amount})</label>
                        <input 
                          type="number" 
                          value={refundAmount}
                          onChange={(e) => setRefundAmount(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Reason</label>
                        <select 
                          value={refundReason}
                          onChange={(e) => setRefundReason(e.target.value)}
                          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        >
                          <option>Customer requested</option>
                          <option>Duplicate payment</option>
                          <option>Service issue</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="flex space-x-3 pt-2">
                        <button onClick={() => setRefundStep(0)} className="flex-1 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                        <button onClick={() => setRefundStep(2)} className="flex-1 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700">Continue</button>
                      </div>
                    </div>
                  )}

                  {refundStep === 2 && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center space-y-4">
                      <p className="text-sm font-bold text-red-900">Are you sure you want to refund ₹{refundAmount}?</p>
                      <p className="text-xs text-red-700">This action cannot be undone.</p>
                      <div className="flex space-x-3 pt-2">
                        <button disabled={refunding} onClick={() => setRefundStep(1)} className="flex-1 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Back</button>
                        <button disabled={refunding} onClick={handleRefundSubmit} className="flex-1 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50">
                          {refunding ? 'Processing...' : 'Confirm Refund'}
                        </button>
                      </div>
                    </div>
                  )}

                  {refundStep === 3 && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                      <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      <p className="text-sm font-medium text-green-800">Refund Processed Successfully</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
