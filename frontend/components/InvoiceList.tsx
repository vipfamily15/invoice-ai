'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Button from './ui/Button';

interface Invoice {
  id: string;
  vendorName: string;
  amount: number;
  currency: string;
  invoiceDate: string;
  status: string;
  createdAt: string;
}

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchInvoices();
  }, [page]);

  const fetchInvoices = async () => {
    try {
      const response = await api.get(`/api/invoices?page=${page}`);
      setInvoices(response.data.invoices);
    } catch (error) {
      console.error('Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/api/invoices/${id}`);
        fetchInvoices();
      } catch (error) {
        alert('Failed to delete invoice');
      }
    }
  };

  if (isLoading) return <div className="text-center py-8">⏳ Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">📊 Your Invoices</h2>
      {invoices.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No invoices yet. Upload one to get started!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Vendor</th>
                <th className="border p-3 text-left">Amount</th>
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="border p-3">{invoice.vendorName}</td>
                  <td className="border p-3">{invoice.currency} {invoice.amount.toFixed(2)}</td>
                  <td className="border p-3">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                  <td className="border p-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      invoice.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="border p-3 space-x-2">
                    <Button size="sm" variant="secondary">View</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(invoice.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
