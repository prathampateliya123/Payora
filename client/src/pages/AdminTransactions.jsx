import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/common/StatusBadge';
import { getAdminTransactions } from '../services/billing.service';
import { Search, Filter, AlertCircle, Copy, CreditCard, Activity, XCircle, RotateCcw } from 'lucide-react';
import { AdminTransactionDetailsDrawer } from '../components/admin/AdminTransactionDetailsDrawer';

export const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTxnId, setSelectedTxnId] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getAdminTransactions();
      setTransactions(res.data);
    } catch (err) {
      setError('Something went wrong while loading transactions.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatId = (id) => id ? id.substring(0, 8) + '...' : '';

  const totalAmount = transactions.filter(t => t.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalRefunded = transactions.filter(t => t.status.includes('Refund')).reduce((acc, curr) => acc + curr.amount, 0);
  const failedCount = transactions.filter(t => t.status === 'Failed').length;

  return (
    <AppLayout 
      title="Transactions (Admin)" 
      subtitle="Monitor all payment activity across Payora."
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow px-5 py-6 flex items-center">
          <div className="flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Transactions</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">{transactions.length}</dd>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow px-5 py-6 flex items-center">
          <div className="flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">Successful Volume</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</dd>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <CreditCard className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow px-5 py-6 flex items-center">
          <div className="flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">Failed Payments</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">{failedCount}</dd>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow px-5 py-6 flex items-center">
          <div className="flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">Refunded Volume</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">₹{totalRefunded.toLocaleString('en-IN')}</dd>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            <RotateCcw className="h-6 w-6 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
              placeholder="Search payment ID, transaction ID, email..."
            />
          </div>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="mr-2 h-4 w-4 text-gray-500" />
              Filter
            </button>
          </div>
        </div>

        {error ? (
          <div className="p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Unable to load</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
          </div>
        ) : loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 flex items-center group">
                      {formatId(txn.id)}
                      <button onClick={() => copyToClipboard(txn.id)} className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600">
                        <Copy className="h-3 w-3" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{txn.user || 'Unknown User'}</div>
                      <div className="text-sm text-gray-500">{txn.email || 'user@example.com'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{txn.plan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{txn.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(txn.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={txn.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => setSelectedTxnId(txn.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminTransactionDetailsDrawer
        transactionId={selectedTxnId}
        isOpen={!!selectedTxnId}
        onClose={() => setSelectedTxnId(null)}
        onRefundSuccess={fetchTransactions}
      />
    </AppLayout>
  );
};
