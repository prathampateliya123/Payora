import { useState, useEffect } from 'react';
import { getSubscriptionHistory } from '../../services/app.service';

export const SubscriptionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getSubscriptionHistory();
        if (res.success) {
          setHistory(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-4 text-center text-sm text-gray-500">Loading history...</div>;
  if (history.length === 0) return <div className="p-4 text-center text-sm text-gray-500">No subscription history found.</div>;

  const formatAction = (action) => {
    return action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="border-t border-gray-200">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-900">Recent History</h4>
      </div>
      <ul className="divide-y divide-gray-200">
        {history.map((record) => (
          <li key={record._id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">{formatAction(record.action)}</p>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  {record.previousPlan && record.newPlan ? (
                    <span>{record.previousPlan.name} → {record.newPlan.name}</span>
                  ) : record.previousPlan ? (
                    <span>{record.previousPlan.name}</span>
                  ) : null}
                  {record.previousBillingCycle && record.newBillingCycle && record.previousBillingCycle !== record.newBillingCycle && (
                    <span className="ml-2">({record.previousBillingCycle} → {record.newBillingCycle})</span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(record.createdAt).toLocaleDateString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
