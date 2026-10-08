import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/common/StatusBadge';
import { getInvoiceById } from '../services/billing.service';
import { Download, ArrowLeft, Printer } from 'lucide-react';

export const InvoicePreview = ({ invoice }) => {
  if (!invoice) return null;

  return (
    <div className="bg-white shadow-lg border border-gray-100 rounded-lg overflow-hidden max-w-4xl mx-auto my-8 print:shadow-none print:border-none print:m-0">
      {/* Header */}
      <div className="p-8 sm:p-12 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">PAYORA</h2>
          <p className="text-gray-500 mt-1">Subscription Billing Platform</p>
        </div>
        <div className="mt-6 sm:mt-0 text-left sm:text-right">
          <h3 className="text-xl font-medium text-gray-900">Invoice</h3>
          <p className="text-gray-500 font-mono mt-1">{invoice.id}</p>
          <div className="mt-2">
            <StatusBadge status={invoice.status} />
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="p-8 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">From</h4>
          <p className="text-gray-900 font-medium">Payora Inc.</p>
          <p className="text-gray-500 text-sm mt-1">123 Payment Street</p>
          <p className="text-gray-500 text-sm">Tech Park, Bangalore</p>
          <p className="text-gray-500 text-sm">India, 560001</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Billed To</h4>
          <p className="text-gray-900 font-medium">{invoice.customerName}</p>
          <p className="text-gray-500 text-sm mt-1">{invoice.customerEmail}</p>
        </div>
      </div>

      {/* Details */}
      <div className="px-8 sm:px-12 py-6 bg-gray-50 border-y border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Date</p>
          <p className="mt-1 text-gray-900 font-medium">{new Date(invoice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Method</p>
          <p className="mt-1 text-gray-900 font-medium">{invoice.method}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</p>
          <p className="mt-1 text-gray-900 font-mono text-sm">{invoice.transactionId}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment ID</p>
          <p className="mt-1 text-gray-900 font-mono text-sm">{invoice.paymentId}</p>
        </div>
      </div>

      {/* Line Items */}
      <div className="p-8 sm:p-12">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th scope="col" className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="pb-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-4 text-sm text-gray-900">
                <p className="font-medium">{invoice.plan} Plan</p>
                <p className="text-gray-500 mt-1">Billing Cycle: {invoice.billingCycle}</p>
              </td>
              <td className="py-4 text-sm text-gray-900 font-medium text-right">₹{invoice.amount}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-8 flex justify-end">
          <dl className="w-full sm:w-64 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd className="text-gray-900 font-medium">₹{invoice.amount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Tax (0%)</dt>
              <dd className="text-gray-900 font-medium">₹0</dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <dt className="text-base font-bold text-gray-900">Total</dt>
              <dd className="text-base font-bold text-gray-900">₹{invoice.amount}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 text-center sm:text-left text-sm text-gray-500">
        <p>If you have any questions about this invoice, please contact support@payora.com.</p>
      </div>
    </div>
  );
};

export const InvoiceDetail = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await getInvoiceById(invoiceId);
        setInvoice(res.data);
      } catch (err) {
        setError('Invoice not found or unable to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <Link to="/billing" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Billing
        </Link>
        {invoice && (
          <div className="flex space-x-3">
            <button onClick={() => window.print()} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition">
              <Printer className="mr-2 h-4 w-4 text-gray-500" />
              Print
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="max-w-4xl mx-auto bg-white shadow-lg border border-gray-100 rounded-lg p-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      ) : error ? (
        <div className="max-w-4xl mx-auto bg-white p-12 text-center rounded-lg shadow border border-gray-200">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <InvoicePreview invoice={invoice} />
      )}
    </AppLayout>
  );
};
