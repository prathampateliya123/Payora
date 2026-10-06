import { useState } from 'react';
import api from '../../services/api';

export const CancelSubscriptionModal = ({ isOpen, onClose, subscription, onCancellationRequested }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCancel = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/subscriptions/cancel', {
        subscriptionId: subscription.id
      });
      if (res.data.success) {
        onCancellationRequested();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Subscription?</h3>
        
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to cancel your subscription? You will continue to have access to your current plan until the end of your current billing period.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Keep Subscription
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Cancelling...' : 'Cancel Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
};
