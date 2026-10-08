import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlans } from '../services/app.service';
import { useAuth } from '../hooks/useAuth';

export const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState('');
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getPlans();
        if (res.success) {
          setPlans(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch plans', err);
        setError('Failed to load pricing plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (plan.name === 'FREE') {
      navigate('/dashboard');
      return;
    }

    setSubscribing(true);
    setError('');

    try {
      // 1. Create Subscription on Backend
      const res = await api.post('/subscriptions/create', {
        planId: plan._id,
        billingCycle: 'monthly', // Defaulting to monthly for UI simplicity, can be dynamic
      });

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      const { subscriptionId, razorpayKeyId, planName } = res.data.data;

      // 2. Load Razorpay SDK
      const resLoad = await loadRazorpayScript();
      if (!resLoad) {
        throw new Error('Razorpay SDK failed to load. Are you online?');
      }

      // 3. Initialize Razorpay
      const options = {
        key: razorpayKeyId,
        subscription_id: subscriptionId,
        name: 'SubFlow',
        description: `${planName} Plan - Monthly Subscription`,
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
        },
        theme: {
          color: '#2563eb',
        },
        handler: function (response) {
          // Frontend Success Callback (Pending webhook confirmation)
          alert(`Payment successful! Reference: ${response.razorpay_payment_id}. Your subscription will be active shortly.`);
          navigate('/subscription');
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading plans...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Pricing Plans
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the right plan for you.
          </p>
        </div>

        {error && (
          <div className="mt-8 bg-red-50 text-red-500 p-4 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-lg shadow-sm divide-y divide-gray-200 border border-gray-200">
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-4 mb-4">
                  <span className="text-4xl font-extrabold text-gray-900">₹{plan.monthlyPrice}</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <ul className="space-y-3 mb-6">
                  {plan.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={subscribing}
                  className="block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700 disabled:opacity-50"
                >
                  {plan.name === 'FREE' ? 'Get Started' : (subscribing ? 'Creating subscription...' : 'Subscribe')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
