'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth.context';
import api from '@/lib/api';
import Button from './ui/Button';

export default function InvoiceUpload({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (['application/pdf', 'image/jpeg', 'image/png'].includes(selectedFile.type)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Only PDF and image files are allowed');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/invoices/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Invoice processed successfully!');
      setFile(null);
      onUploadComplete();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">📤 Upload Invoice</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">{success}</div>}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer block">
          <p className="text-gray-600">📄 Drag and drop or click to select</p>
          <p className="text-sm text-gray-500">PDF or Image (JPG, PNG)</p>
          {file && <p className="text-blue-600 text-sm mt-2">✓ {file.name}</p>}
        </label>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full" variant="primary">
        Process Invoice
      </Button>
    </form>
  );
}
