import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Pricing } from './pages/Pricing.jsx';
import { Subscription } from './pages/Subscription.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { PaymentHistory } from './pages/PaymentHistory.jsx';
import { Billing } from './pages/Billing.jsx';
import { InvoiceDetail } from './pages/InvoiceDetail.jsx';
import { AdminTransactions } from './pages/AdminTransactions.jsx';
import { AdminRefunds } from './pages/AdminRefunds.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { AdminUsers } from './pages/AdminUsers.jsx';
import { AdminSubscriptions } from './pages/AdminSubscriptions.jsx';
import { AdminWebhooks } from './pages/AdminWebhooks.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <PaymentHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing/:invoiceId"
        element={
          <ProtectedRoute>
            <InvoiceDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <ProtectedRoute>
            <AdminTransactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/refunds"
        element={
          <ProtectedRoute>
            <AdminRefunds />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/subscriptions"
        element={
          <ProtectedRoute>
            <AdminSubscriptions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/webhooks"
        element={
          <ProtectedRoute>
            <AdminWebhooks />
          </ProtectedRoute>
        }
      />
      {/* Fallback to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;