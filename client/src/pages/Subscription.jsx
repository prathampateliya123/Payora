import { useState, useEffect } from 'react';
import api from '../services/api';

export const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await api.get('/subscriptions/me');
        if (res.data.success) {
          setSubscription(res.data.data);
        }
      } catch (err) {
        setError('Failed to load subscription details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscription();
  }, []);

  if (loading) return <div className="text-center py-20">Loading subscription...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            My Subscription
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Current plan and billing details.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-500">
            {error}
          </div>
        )}

        {!subscription ? (
          <div className="p-6 text-center text-gray-500">
            You do not have an active subscription.
          </div>
        ) : (
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Plan</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {subscription.plan?.name || 'Unknown'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Billing Cycle</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                  {subscription.billingCycle}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  ₹{subscription.amount}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                    subscription.status === 'created' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription.status}
                  </span>
                  {subscription.status === 'created' && (
                    <p className="mt-2 text-xs text-gray-500 font-normal">
                      Note: If you just paid, the status will update to 'active' shortly once the webhook is processed.
                    </p>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};
