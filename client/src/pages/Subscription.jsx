import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { ChangePlanModal } from '../components/subscription/ChangePlanModal';
import { CancelSubscriptionModal } from '../components/subscription/CancelSubscriptionModal';
import { SubscriptionHistory } from '../components/subscription/SubscriptionHistory';

export const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchSubscription = useCallback(async () => {
    setLoading(true);
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
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handlePlanChanged = () => {
    setSuccessMessage('Subscription plan change requested successfully.');
    fetchSubscription();
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleCancellationRequested = () => {
    setSuccessMessage('Cancellation requested. It will be cancelled at the end of the current billing cycle.');
    fetchSubscription();
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  if (loading && !subscription) return <div className="text-center py-20">Loading subscription...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              My Subscription
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Current plan and billing details.
            </p>
          </div>
          {subscription && ['active'].includes(subscription.status) && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsChangePlanOpen(true)}
                className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50"
              >
                Change Plan
              </button>
              <button
                onClick={() => setIsCancelOpen(true)}
                className="px-3 py-1.5 border border-red-600 text-red-600 rounded-md text-sm font-medium hover:bg-red-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-500 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-green-50 text-green-700 text-sm border-b border-green-200">
            {successMessage}
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
                  {subscription.plan || 'Unknown'}
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
                    subscription.status === 'active' || subscription.status === 'completed' ? 'bg-green-100 text-green-800' :
                    subscription.status === 'created' || subscription.status === 'authenticated' ? 'bg-blue-100 text-blue-800' :
                    subscription.status === 'pending' || subscription.status === 'halted' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {subscription.status === 'created' ? 'Subscription Created' :
                     subscription.status === 'authenticated' ? 'Payment Authenticated' :
                     subscription.status === 'active' ? 'Active Subscription' :
                     subscription.status === 'pending' ? 'Payment Pending' :
                     subscription.status === 'halted' ? 'Payment Issue' :
                     subscription.status === 'cancelled' ? 'Subscription Cancelled' :
                     subscription.status === 'completed' ? 'Subscription Completed' :
                     subscription.status}
                  </span>
                  {(subscription.status === 'created' || subscription.status === 'authenticated') && (
                    <p className="mt-2 text-xs text-gray-500 font-normal">
                      Note: If you just paid, the status will update to 'active' shortly once the webhook is processed.
                    </p>
                  )}
                </dd>
              </div>
              {subscription.nextBillingAt && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Next Billing Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(subscription.nextBillingAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {subscription && <SubscriptionHistory />}
      </div>

      {subscription && (
        <>
          <ChangePlanModal 
            isOpen={isChangePlanOpen} 
            onClose={() => setIsChangePlanOpen(false)} 
            currentSubscription={subscription}
            onPlanChanged={handlePlanChanged}
          />
          <CancelSubscriptionModal 
            isOpen={isCancelOpen} 
            onClose={() => setIsCancelOpen(false)} 
            subscription={subscription}
            onCancellationRequested={handleCancellationRequested}
          />
        </>
      )}
    </div>
  );
};
