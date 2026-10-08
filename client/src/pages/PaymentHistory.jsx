import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/common/StatusBadge';
import { TransactionDetailsDrawer } from '../components/transactions/TransactionDetailsDrawer';
import { getTransactions, getTransactionById } from '../services/billing.service';
import { Search, Filter, FileText, Copy, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PaymentHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      setError('Something went wrong while loading your payment history.');
    } finally {
      setLoading(false);
    }
  };

  const openTransactionDetails = async (id) => {
    try {
      const res = await getTransactionById(id);
      setSelectedTxn(res.data);
      setIsDrawerOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: show a small toast
  };

  const formatTxnId = (id) => {
    if (!id) return '';
    return id.substring(0, 8) + '...' + id.substring(id.length - 4);
  };

  return (
    <AppLayout 
      title="Payment History" 
      subtitle="View and manage all your payments and transactions."
    >
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
              placeholder="Search transaction ID..."
            />
          </div>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="mr-2 h-4 w-4 text-gray-500" />
              Filters
            </button>
          </div>
        </div>

        {error ? (
          <div className="p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Unable to load transactions</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button onClick={fetchTransactions} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Try Again
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments yet</h3>
            <p className="mt-1 text-sm text-gray-500">Your payment history will appear here once you complete a transaction.</p>
            <div className="mt-6">
              <Link to="/pricing" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                View Plans
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(txn.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 flex items-center group">
                      {formatTxnId(txn.paymentId)}
                      <button onClick={() => copyToClipboard(txn.paymentId)} className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600">
                        <Copy className="h-3 w-3" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{txn.plan} {txn.billingCycle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{txn.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={txn.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {txn.invoiceId ? (
                        <Link to={`/billing/${txn.invoiceId}`} className="hover:underline">Invoice</Link>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openTransactionDetails(txn.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TransactionDetailsDrawer 
        transaction={selectedTxn}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </AppLayout>
  );
};
