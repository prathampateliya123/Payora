import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/common/StatusBadge';
import { getInvoices } from '../services/billing.service';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await getInvoices();
      setInvoices(res.data);
    } catch (err) {
      setError('Something went wrong while loading your invoices.');
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <AppLayout 
      title="Billing & Invoices" 
      subtitle="Manage your invoices and billing history."
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow px-5 py-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Paid</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">₹{totalPaid.toLocaleString('en-IN')}</dd>
        </div>
        <div className="bg-white rounded-lg shadow px-5 py-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Invoices</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{invoices.length}</dd>
        </div>
        <div className="bg-white rounded-lg shadow px-5 py-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Current Plan</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">PRO</dd>
        </div>
        <div className="bg-white rounded-lg shadow px-5 py-6">
          <dt className="text-sm font-medium text-gray-500 truncate">Next Billing</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">15 Oct 2026</dd>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Invoices</h3>
        </div>

        {error ? (
          <div className="p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Unable to load invoices</h3>
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
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices yet</h3>
            <p className="mt-1 text-sm text-gray-500">Your invoices will appear here after a successful payment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{invoice.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <Link to={`/billing/${invoice.id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
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
