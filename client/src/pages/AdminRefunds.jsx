import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/common/StatusBadge';
import { getAdminRefunds } from '../services/billing.service';
import { Search, Filter, AlertCircle, RefreshCcw } from 'lucide-react';

export const AdminRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      const res = await getAdminRefunds();
      setRefunds(res.data);
    } catch (err) {
      setError('Something went wrong while loading refunds.');
    } finally {
      setLoading(false);
    }
  };

  const totalRefunded = refunds.filter(r => r.status === 'Processed').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingRefunds = refunds.filter(r => r.status === 'Pending').length;

  return (
    <AppLayout 
      title="Refunds" 
      subtitle="Monitor refund activity."
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow px-5 py-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Refunds</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{refunds.length}</dd>
        </div>
        <div className="bg-white rounded-lg shadow px-5 py-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Processed</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{refunds.filter(r => r.status === 'Processed').length}</dd>
        </div>
        <div className="bg-white rounded-lg shadow px-5 py-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{pendingRefunds}</dd>
        </div>
        <div className="bg-white rounded-lg shadow px-5 py-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Refunded Amount</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">₹{totalRefunded.toLocaleString('en-IN')}</dd>
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
              placeholder="Search refund ID, transaction ID..."
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
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : refunds.length === 0 ? (
          <div className="p-12 text-center">
            <RefreshCcw className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No refunds</h3>
            <p className="mt-1 text-sm text-gray-500">Refund activity will appear here when a payment is refunded.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {refunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{refund.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 hover:underline cursor-pointer">{refund.transactionId.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{refund.user || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{refund.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{refund.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={refund.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(refund.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-600">
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
    </AppLayout>
  );
};
