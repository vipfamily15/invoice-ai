'use client';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">⚙️ Settings</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2" disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
