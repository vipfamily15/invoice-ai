'use client';

import React from 'react';
import RegisterForm from '@/components/forms/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <RegisterForm />
      </div>
    </div>
  );
}
