'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  invoicesLimit: number;
  features: string[];
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/api/subscriptions/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await api.post('/api/subscriptions/create', { planId });
      alert('Subscription created successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create subscription');
    }
  };

  if (isLoading) return <div className="text-center py-8">⏳ Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">💳 Plans & Pricing</h1>
        <p className="text-gray-600">Choose the perfect plan for your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <p className="text-4xl font-bold text-blue-600 mb-4">
              ${plan.price}/month
            </p>
            <p className="text-gray-600 mb-6">{plan.invoicesLimit} invoices/month</p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="text-gray-600">✓ {feature}</li>
              ))}
            </ul>
            <Button
              className="w-full"
              onClick={() => handleSubscribe(plan.id)}
            >
              Subscribe Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
