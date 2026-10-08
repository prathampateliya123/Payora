import { X, CheckCircle, Clock, FileText, Download } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Link } from 'react-router-dom';

export const TransactionDetailsDrawer = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Transaction Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-center mb-8">
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
              transaction.status === 'Paid' ? 'bg-green-100' : 
              transaction.status === 'Failed' ? 'bg-red-100' : 'bg-yellow-100'
            }`}>
              {transaction.status === 'Paid' ? <CheckCircle className="h-6 w-6 text-green-600" /> : <Clock className="h-6 w-6 text-yellow-600" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {transaction.status === 'Paid' ? 'Payment Successful' : `Payment ${transaction.status}`}
            </h3>
            <p className="text-3xl font-extrabold text-gray-900 mb-2">₹{transaction.amount}</p>
            <p className="text-sm text-gray-500">{transaction.plan} {transaction.billingCycle}</p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Information</h4>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Payment ID</dt>
                  <dd className="text-gray-900 font-mono">{transaction.paymentId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Transaction ID</dt>
                  <dd className="text-gray-900 font-mono">{transaction.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Payment Date</dt>
                  <dd className="text-gray-900">{new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Method</dt>
                  <dd className="text-gray-900">{transaction.method}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Currency</dt>
                  <dd className="text-gray-900">INR</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-gray-500">Status</dt>
                  <dd><StatusBadge status={transaction.status} /></dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Amount Breakdown</h4>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Subtotal</dt>
                  <dd className="text-gray-900">₹{transaction.amount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Tax</dt>
                  <dd className="text-gray-900">₹0</dd>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100 font-medium">
                  <dt className="text-gray-900">Total</dt>
                  <dd className="text-gray-900">₹{transaction.amount}</dd>
                </div>
              </dl>
            </div>

            {transaction.refund && (
              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Refund Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Original Amount</dt>
                    <dd className="text-gray-900 line-through text-gray-400">₹{transaction.refund.originalAmount}</dd>
                  </div>
                  <div className="flex justify-between font-medium">
                    <dt className="text-red-600">Refunded</dt>
                    <dd className="text-red-600">- ₹{transaction.refund.amount}</dd>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                    <dt className="text-gray-900">Remaining</dt>
                    <dd className="text-gray-900">₹{transaction.refund.originalAmount - transaction.refund.amount}</dd>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="text-xs font-semibold text-gray-900 mb-2">Refund History</h5>
                    <div className="relative pl-4 border-l-2 border-gray-200">
                      <div className="absolute w-2 h-2 bg-gray-400 rounded-full -left-[5px] top-1.5"></div>
                      <p className="text-xs text-gray-500 mb-1">{new Date(transaction.refund.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p className="text-sm font-medium text-gray-900">Refund initiated (₹{transaction.refund.amount})</p>
                      <p className="text-xs text-gray-500 mt-1">Reason: {transaction.refund.reason}</p>
                      <p className="text-xs font-medium text-green-600 mt-1">{transaction.refund.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex flex-col space-y-3">
          {transaction.invoiceId && (
            <Link 
              to={`/billing/${transaction.invoiceId}`}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              <FileText className="mr-2 h-4 w-4 text-gray-500" />
              View Invoice
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
