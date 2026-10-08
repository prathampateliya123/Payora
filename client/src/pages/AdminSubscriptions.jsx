import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { getAdminSubscriptions } from '../services/app.service';

export const AdminSubscriptions = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const res = await getAdminSubscriptions();
      setSubs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Subscriptions" subtitle="Manage all active and inactive subscriptions.">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Billing</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{sub.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.plan} ({sub.billingCycle})</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{sub.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sub.status === 'Active' ? 'bg-green-100 text-green-800' :
                        sub.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        sub.status === 'Halted' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sub.nextBillingAt ? new Date(sub.nextBillingAt).toLocaleDateString() : '—'}
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
