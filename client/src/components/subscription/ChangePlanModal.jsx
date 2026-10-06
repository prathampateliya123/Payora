import { useState, useEffect } from 'react';
import api from '../../services/api';

export const ChangePlanModal = ({ isOpen, onClose, currentSubscription, onPlanChanged }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
      if (currentSubscription) {
        setSelectedPlanId(currentSubscription.planId);
        setBillingCycle(currentSubscription.billingCycle || 'monthly');
      }
    }
  }, [isOpen, currentSubscription]);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/plans');
      if (res.data.success) {
        // filter out FREE plan if current is not free, etc. 
        setPlans(res.data.data.filter(p => p.name !== 'FREE'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const selectedPlan = plans.find(p => p._id === selectedPlanId);
  const newPrice = selectedPlan ? (billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlanId) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/subscriptions/change-plan', {
        subscriptionId: currentSubscription.id,
        newPlanId: selectedPlanId,
        billingCycle
      });
      
      if (res.data.success) {
        onPlanChanged();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Subscription</h3>
        
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-500">Current Plan:</p>
          <p className="font-medium">{currentSubscription.plan} — ₹{currentSubscription.amount}/{currentSubscription.billingCycle === 'monthly' ? 'mo' : 'yr'}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select new plan:</label>
            <div className="grid grid-cols-2 gap-3">
              {plans.map(plan => (
                <div
                  key={plan._id}
                  onClick={() => setSelectedPlanId(plan._id)}
                  className={`border rounded-lg p-3 cursor-pointer ${selectedPlanId === plan._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <p className="font-medium text-gray-900">{plan.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Billing Cycle:</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="billingCycle"
                  value="monthly"
                  checked={billingCycle === 'monthly'}
                  onChange={() => setBillingCycle('monthly')}
                />
                <span className="ml-2 text-sm text-gray-700">Monthly</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="billingCycle"
                  value="yearly"
                  checked={billingCycle === 'yearly'}
                  onChange={() => setBillingCycle('yearly')}
                />
                <span className="ml-2 text-sm text-gray-700">Yearly</span>
              </label>
            </div>
          </div>

          {selectedPlan && (
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-500">New Price</p>
              <p className="text-2xl font-bold text-gray-900">₹{newPrice}/{billingCycle === 'monthly' ? 'month' : 'year'}</p>
              <p className="text-xs text-gray-500 mt-1">Are you sure you want to change your subscription?</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedPlanId || (selectedPlanId === currentSubscription.planId && billingCycle === currentSubscription.billingCycle)}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Change'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
