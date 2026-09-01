import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Plus, 
  DollarSign, 
  FileText, 
  Printer, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Download,
  CreditCard,
  Building,
  Mail,
  Check
} from 'lucide-react';
import { Invoice, Customer, Job, PaymentStatus, PaymentMethod } from '../types';
import { EmailService } from '../services/emailService';

interface InvoicingViewProps {
  invoices: Invoice[];
  customers: Customer[];
  onSaveInvoice: (invoice: Invoice) => void;
  onUpdateInvoiceStatus: (invoiceId: string, status: PaymentStatus, method?: PaymentMethod) => void;
  onOpenCustomerComm: (invoice: Invoice, type: 'reminder') => void;
}

export const InvoicingView: React.FC<InvoicingViewProps> = ({
  invoices,
  customers,
  onSaveInvoice,
  onUpdateInvoiceStatus,
  onOpenCustomerComm
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Partial<Invoice> | null>(null);
  const [isSendingInvoiceEmail, setIsSendingInvoiceEmail] = useState(false);
  const [invoiceEmailSent, setInvoiceEmailSent] = useState(false);

  const handleSendInvoiceEmail = async (invoice: Invoice) => {
    setIsSendingInvoiceEmail(true);
    try {
      await EmailService.sendInvoiceEmail(invoice);
      setInvoiceEmailSent(true);
      setTimeout(() => setInvoiceEmailSent(false), 3000);
    } catch (e) {
      console.warn('Invoice email dispatch handled:', e);
    } finally {
      setIsSendingInvoiceEmail(false);
    }
  };

  // Revenue Totals
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const totalUnpaid = invoices.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + i.total, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0);
  const totalTaxCollected = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.tax, 0);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    const cust = customers[0] || { id: 'c1', name: 'Amara Vance', email: 'amara@vance.ca', address: '180 University Ave' };
    const subtotal = 185.00;
    const tax = +(subtotal * 0.13).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    setEditingInvoice({
      id: 'inv-' + Date.now(),
      invoiceNumber: `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      customerAddress: cust.address,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      items: [
        { id: 'item-1', description: 'Crisp Standard Detail Residential Clean (2.5 hrs)', quantity: 1, unitPrice: subtotal, amount: subtotal }
      ],
      subtotal: subtotal,
      tax: tax,
      total: total,
      status: 'unpaid',
      notes: 'Payment terms: Due within 7 days. We accept Interac e-Transfer to billing@crispcleaners.ca or major credit cards.'
    });
    setIsNewModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice || !editingInvoice.customerName) return;
    onSaveInvoice(editingInvoice as Invoice);
    setIsNewModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-600" />
            Invoicing & Revenue Hub
          </h1>
          <p className="text-xs text-slate-500">
            Automated billing, 13% Ontario HST calculation, e-Transfer / Card payment tracking
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          + Create Custom Invoice
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Collected</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">${totalPaid.toFixed(2)}</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Paid in full</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending / Unpaid</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">${totalUnpaid.toFixed(2)}</p>
          <span className="text-xs text-teal-700 font-semibold mt-1 block">Awaiting payment</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Overdue Invoices</span>
          <p className="text-2xl font-bold text-amber-700 mt-1">${totalOverdue.toFixed(2)}</p>
          <span className="text-xs text-amber-800 font-semibold mt-1 block">Requires AI follow-up</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ontario 13% HST</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">${totalTaxCollected.toFixed(2)}</p>
          <span className="text-xs text-slate-500 font-medium mt-1 block">Tax collected</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice number or customer name..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'paid', 'unpaid', 'overdue'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === status 
                  ? 'bg-teal-50 text-teal-800 border border-teal-200' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No invoices matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <strong className="font-bold text-slate-900 block">{inv.customerName}</strong>
                      <span className="text-slate-400 text-[11px]">{inv.customerEmail}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">{inv.issueDate}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{inv.dueDate}</td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${inv.total.toFixed(2)} CAD
                      <span className="block text-[10px] text-slate-400 font-normal">
                        incl. ${inv.tax.toFixed(2)} HST
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {inv.paymentMethod ? (
                        <span className="capitalize font-medium">{inv.paymentMethod.replace('_', ' ')}</span>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        inv.status === 'overdue' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
                        >
                          View / Print
                        </button>

                        {inv.status !== 'paid' && (
                          <button
                            onClick={() => onUpdateInvoiceStatus(inv.id, 'paid', 'etransfer')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Professional Printable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl max-h-[95vh] overflow-y-auto space-y-6 text-slate-800">
            {/* Header with Crisp Cleaners Wordmark */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-amber-200 font-bold text-sm">
                    CC
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-sans">
                    Crisp<span className="text-teal-600">Cleaners</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-500">Crisp Cleaners Inc. • GST/HST #849302194RT0001</p>
                <p className="text-xs text-slate-500">100 King St West, Toronto, ON M5X 1A9 • (416) 555-CRISP</p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight block">INVOICE</span>
                <span className="font-mono text-xs font-bold text-teal-700">{selectedInvoice.invoiceNumber}</span>
                <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase mt-2 ${
                  selectedInvoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                  selectedInvoice.status === 'overdue' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                }`}>
                  Status: {selectedInvoice.status}
                </span>
              </div>
            </div>

            {/* Bill To & Dates */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Billed To</span>
                <p className="font-bold text-slate-900 text-sm">{selectedInvoice.customerName}</p>
                <p className="text-slate-600">{selectedInvoice.customerAddress}</p>
                <p className="text-slate-600">{selectedInvoice.customerEmail}</p>
              </div>

              <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice Date:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedInvoice.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Due:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedInvoice.dueDate}</span>
                </div>
                {selectedInvoice.paidAt && (
                  <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                    <span>Paid On:</span>
                    <span>{selectedInvoice.paidAt}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Item Description</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Rate</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items.map(item => (
                    <tr key={item.id}>
                      <td className="py-3 px-4 font-medium text-slate-800">{item.description}</td>
                      <td className="py-3 px-4 text-center font-mono">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1.5 text-xs text-right">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">${selectedInvoice.subtotal.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ontario HST (13%):</span>
                  <span className="font-mono">${selectedInvoice.tax.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Due:</span>
                  <span className="font-mono text-teal-800">${selectedInvoice.total.toFixed(2)} CAD</span>
                </div>
              </div>
            </div>

            {/* Payment & E-transfer Instructions */}
            <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-teal-900">Payment Instructions:</span>
              <p className="text-slate-700">
                Please send Interac e-Transfer to <strong className="text-teal-800">billing@crispcleaners.ca</strong> with your Invoice #{selectedInvoice.invoiceNumber} in the message, or pay via credit card online.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                {selectedInvoice.status !== 'paid' && (
                  <button
                    onClick={() => {
                      onUpdateInvoiceStatus(selectedInvoice.id, 'paid', 'etransfer');
                      setSelectedInvoice({ ...selectedInvoice, status: 'paid', paidAt: new Date().toISOString().split('T')[0] });
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Mark as Paid (e-Transfer)
                  </button>
                )}

                <button
                  onClick={() => handleSendInvoiceEmail(selectedInvoice)}
                  disabled={isSendingInvoiceEmail}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {invoiceEmailSent ? <Check className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                  <span>{isSendingInvoiceEmail ? 'Sending...' : invoiceEmailSent ? 'Emailed to Client & Admin!' : 'Email Invoice'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Invoice
                </button>
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Invoice Modal */}
      {isNewModalOpen && editingInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Generate New Custom Invoice</h3>

            <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select Customer</label>
                <select
                  value={editingInvoice.customerId}
                  onChange={(e) => {
                    const cust = customers.find(c => c.id === e.target.value);
                    if (cust && editingInvoice) {
                      setEditingInvoice({
                        ...editingInvoice,
                        customerId: cust.id,
                        customerName: cust.name,
                        customerEmail: cust.email,
                        customerAddress: cust.address
                      });
                    }
                  }}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Invoice Number</label>
                  <input
                    type="text"
                    value={editingInvoice.invoiceNumber || ''}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, invoiceNumber: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Due Date</label>
                  <input
                    type="date"
                    value={editingInvoice.dueDate || ''}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, dueDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Subtotal ($ CAD - Before 13% HST)</label>
                <input
                  type="number"
                  step="5"
                  value={editingInvoice.subtotal || 0}
                  onChange={(e) => {
                    const sub = parseFloat(e.target.value) || 0;
                    const tax = +(sub * 0.13).toFixed(2);
                    const total = +(sub + tax).toFixed(2);
                    setEditingInvoice({
                      ...editingInvoice,
                      subtotal: sub,
                      tax: tax,
                      total: total,
                      items: [{ id: 'item-1', description: 'Cleaning Service', quantity: 1, unitPrice: sub, amount: sub }]
                    });
                  }}
                  className="w-full p-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Ontario HST (13%):</span>
                  <span className="font-bold font-mono">${editingInvoice.tax?.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between text-teal-800 font-bold">
                  <span>Total Billed:</span>
                  <span className="font-mono text-sm">${editingInvoice.total?.toFixed(2)} CAD</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Save & Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
