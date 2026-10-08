import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { getDashboardData } from '../services/app.service';
import { Activity, CreditCard, Users, RefreshCcw, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getDashboardData();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <AppLayout title="Admin Analytics">
        <div className="p-12 text-center text-gray-500">Loading analytics...</div>
      </AppLayout>
    );
  }

  const { stats, revenueData, planDistribution } = data;

  return (
    <AppLayout title="Admin Analytics" subtitle="Platform overview and revenue metrics">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow px-5 py-6 flex items-center">
          <div className="flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">₹{stats.monthlyRevenue.toLocaleString()}</dd>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow px-5 py-6 flex items-center">
          <div className="flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">Active Subscriptions</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.activeSubscriptions.toLocaleString()}</dd>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow px-5 py-6 flex items-center">
          <div className="flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">Successful Payments</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.successfulPayments.toLocaleString()}</dd>
          </div>
          <div className="bg-indigo-100 p-3 rounded-full">
            <CreditCard className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow px-5 py-6 flex items-center">
          <div className="flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">Refunded Amount</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">₹{stats.refundedAmount.toLocaleString()}</dd>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            <RefreshCcw className="h-6 w-6 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart mock UI */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Revenue (Last 6 Months)</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.map((d) => {
              const height = (d.amount / 400000) * 100;
              return (
                <div key={d.month} className="flex flex-col items-center w-full group">
                  <div 
                    className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors relative"
                    style={{ height: `${height}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                      ₹{d.amount.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{d.month.substring(0, 3)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan Distribution mock UI */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Plan Distribution</h3>
          <div className="space-y-6 mt-8">
            {planDistribution.map(p => {
              const total = planDistribution.reduce((acc, curr) => acc + curr.value, 0);
              const percent = ((p.value / total) * 100).toFixed(1);
              return (
                <div key={p.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{p.name} Plan</span>
                    <span className="text-gray-500">{p.value} users ({percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${p.name === 'Pro' ? 'bg-blue-600' : p.name === 'Premium' ? 'bg-indigo-600' : 'bg-gray-400'}`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
