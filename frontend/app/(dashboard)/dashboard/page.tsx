'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth.context';
import api from '@/lib/api';
import InvoiceUpload from '@/components/InvoiceUpload';
import InvoiceList from '@/components/InvoiceList';
import Button from '@/components/ui/Button';

interface Stats {
  totalInvoices: number;
  processedToday: number;
  totalAmount: number;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalInvoices: 0,
    processedToday: 0,
    totalAmount: 0,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (loading) return <div className="text-center py-8">⏳ Loading...</div>;

  if (!user) {
    return <div className="text-center py-8">Please log in to continue</div>;
  }

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">👋 Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Manage and process your invoices with AI</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Invoices</p>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Processed Today</p>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Amount</p>
          <p className="text-3xl font-bold text-purple-600">$0</p>
        </div>
      </div>

      {/* Upload Section */}
      <InvoiceUpload onUploadComplete={handleUploadComplete} />

      {/* Invoice List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <InvoiceList key={refreshTrigger} />
      </div>
    </div>
  );
}
