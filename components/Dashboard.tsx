'use client';

import { useState } from 'react';
import { useRealtimeData, useRealtimeList, useFirebaseMutation } from '@/hooks/useFirebase';

interface SensorReading {
  id: string;
  temperature: number;
  humidity: number;
  gas: number;
  time: number;
}

export default function Dashboard() {
  const { data: dashboardData, loading, error } = useRealtimeData('dashboard');
  const { list: sensorLogs, loading: logsLoading } = useRealtimeList('lionbit/device01/logs');
  const { writeData } = useFirebaseMutation();
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  const handleUpdateData = async () => {
    const timestamp = new Date().toISOString();
    const result = await writeData('dashboard', {
      lastUpdated: timestamp,
      status: 'active',
      metrics: {
        users: Math.floor(Math.random() * 1000),
        revenue: Math.floor(Math.random() * 10000),
        orders: Math.floor(Math.random() * 500)
      }
    });

    if (result.success) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('error');
      console.error('Firebase write error:', result.error);
    }
  };

  const handleTestConnection = async () => {
    setConnectionStatus('checking');
    const result = await writeData('test', {
      timestamp: new Date().toISOString(),
      message: 'Connection test successful'
    });

    if (result.success) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('error');
      console.error('Firebase connection test failed:', result.error);
    }
  };

  // Get latest sensor reading
  const latestReading = sensorLogs.length > 0 ? sensorLogs[sensorLogs.length - 1] as SensorReading : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Loading dashboard data...</div>
          <div className="text-sm text-gray-600 mt-2">Connecting to Firebase...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Connection Error</div>
          <div className="text-gray-700 mb-4">{error}</div>
          <button
            onClick={handleTestConnection}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Test Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">IoT Sensor Dashboard</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm text-gray-600">
              {connectionStatus === 'connected' ? 'Connected' :
               connectionStatus === 'error' ? 'Connection Error' : 'Checking...'}
            </span>
          </div>
        </div>

        {/* Sensor Data Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Device01 - Latest Sensor Reading</h2>
          {latestReading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Temperature</div>
                <div className="text-3xl font-bold text-blue-900">
                  {latestReading.temperature}°C
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Humidity</div>
                <div className="text-3xl font-bold text-green-900">
                  {latestReading.humidity}%
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Gas Level</div>
                <div className="text-3xl font-bold text-orange-900">
                  {latestReading.gas}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Time</div>
                <div className="text-2xl font-bold text-purple-900">
                  {latestReading.time}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {logsLoading ? 'Loading sensor data...' : 'No sensor data available'}
            </div>
          )}
        </div>

        {/* Sensor Logs Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Sensor Logs History</h2>
          {sensorLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Time</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Temperature (°C)</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Humidity (%)</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Gas Level</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Log ID</th>
                  </tr>
                </thead>
                <tbody>
                  {sensorLogs.slice(-10).reverse().map((log, index) => {
                    const sensorLog = log as SensorReading;
                    return (
                      <tr key={sensorLog.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-sm text-gray-900">{sensorLog.time}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{sensorLog.temperature}°C</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{sensorLog.humidity}%</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{sensorLog.gas}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 font-mono text-xs">{sensorLog.id}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {logsLoading ? 'Loading logs...' : 'No sensor logs available'}
            </div>
          )}
        </div>

        {/* Dashboard Status Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Status</div>
              <div className="text-2xl font-bold text-blue-900">
                {dashboardData?.status || 'No data'}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Last Updated</div>
              <div className="text-lg font-bold text-green-900">
                {dashboardData?.lastUpdated
                  ? new Date(dashboardData.lastUpdated).toLocaleString()
                  : 'Never'
                }
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Firebase Project</div>
              <div className="text-lg font-bold text-purple-900">lionbit-test</div>
            </div>
          </div>
        </div>

        {dashboardData?.metrics && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">System Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-sm text-indigo-600 font-medium">Active Users</div>
                <div className="text-3xl font-bold text-indigo-900">
                  {dashboardData.metrics.users?.toLocaleString() || 0}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-yellow-600 font-medium">Revenue</div>
                <div className="text-3xl font-bold text-yellow-900">
                  ${dashboardData.metrics.revenue?.toLocaleString() || 0}
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-red-600 font-medium">Orders</div>
                <div className="text-3xl font-bold text-red-900">
                  {dashboardData.metrics.orders?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleUpdateData}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Update Dashboard Data
            </button>
            <button
              onClick={handleTestConnection}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Test Firebase Connection
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Click "Update Dashboard Data" to generate sample system metrics.
            Click "Test Firebase Connection" to verify the connection is working.
          </p>
        </div>
      </div>
    </div>
  );
}