'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth.context';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">🧾 Invoice AI</Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}!</span>
            <Button size="sm" variant="secondary" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      {/* Sidebar + Main */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-6 space-y-4">
            <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-100">📊 Dashboard</Link>
            <Link href="/invoices" className="block px-4 py-2 rounded hover:bg-gray-100">📄 Invoices</Link>
            <Link href="/pricing" className="block px-4 py-2 rounded hover:bg-gray-100">💳 Plans & Pricing</Link>
            <Link href="/settings" className="block px-4 py-2 rounded hover:bg-gray-100">⚙️ Settings</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
