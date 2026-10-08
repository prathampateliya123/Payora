import { useAuth } from '../hooks/useAuth';
import { LogOut, User as UserIcon } from 'lucide-react';

export const Dashboard = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Payora</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition">
                
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex items-center border-b border-gray-200">
            <div className="bg-blue-100 p-2 rounded-full mr-4">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Welcome back, {currentUser?.name}!
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Personal details and application status.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {currentUser?.name}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {currentUser?.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                  {currentUser?.role}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow px-5 py-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Current Plan</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">PRO</dd>
          </div>
          <div className="bg-white rounded-lg shadow px-5 py-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Status</dt>
            <dd className="mt-1 text-2xl font-semibold text-green-600">Active</dd>
          </div>
          <div className="bg-white rounded-lg shadow px-5 py-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Next Billing</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">15 Oct 2026</dd>
          </div>
          <div className="bg-white rounded-lg shadow px-5 py-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Paid</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">₹2,990</dd>
          </div>
        </div>

        {/* Future Subscription Section */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Subscription & Billing
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage your billing, view invoices and transaction history.
              </p>
            </div>
            <div className="flex space-x-3">
              <a href="/pricing" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Plans</a>
              <a href="/subscription" className="text-blue-600 border border-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50">Subscription</a>
              <a href="/billing" className="text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">Invoices</a>
              <a href="/transactions" className="text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">Transactions</a>
            </div>
          </div>
        </div>
      </main>
    </div>);

};