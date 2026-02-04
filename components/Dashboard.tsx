'use client';

import { useState, useEffect } from 'react';
import { useRealtimeData, useRealtimeList, useFirebaseMutation } from '@/hooks/useFirebase';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Thermometer,
  Droplets,
  Wind,
  Clock,
  Wifi,
  WifiOff,
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleUpdateData = async () => {
    setIsRefreshing(true);
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
    setIsRefreshing(false);
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

  // Prepare chart data from sensor logs
  const chartData = sensorLogs.slice(-20).map((log) => {
    const sensorLog = log as SensorReading;
    return {
      time: sensorLog.time,
      temperature: sensorLog.temperature,
      humidity: sensorLog.humidity,
      gas: sensorLog.gas
    };
  });

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="w-4 h-4 text-green-500" />;
      case 'error': return <WifiOff className="w-4 h-4 text-red-500" />;
      default: return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent mx-auto mb-4"></div>
            <div className="text-xl text-white font-semibold">Loading IoT Dashboard...</div>
            <div className="text-purple-300 mt-2">Connecting to Firebase...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <div className="text-red-300 text-xl mb-4">Connection Error</div>
            <div className="text-gray-300 mb-6">{error}</div>
            <button
              onClick={handleTestConnection}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Test Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">IoT Sensor Dashboard</h1>
            <p className="text-purple-300">Real-time monitoring of environmental sensors</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2">
              {getConnectionIcon()}
              <span className="text-white text-sm">
                {connectionStatus === 'connected' ? 'Connected' :
                 connectionStatus === 'error' ? 'Connection Error' : 'Checking...'}
              </span>
            </div>
            <div className="text-right">
              <div className="text-white text-sm">Last Updated</div>
              <div className="text-purple-300 text-xs">
                {dashboardData?.lastUpdated
                  ? new Date(dashboardData.lastUpdated).toLocaleString()
                  : 'Never'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Sensor Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Thermometer className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {latestReading?.temperature || 0}°C
            </div>
            <div className="text-red-100 text-sm">Temperature</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Droplets className="w-8 h-8 opacity-80" />
              <Activity className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {latestReading?.humidity || 0}%
            </div>
            <div className="text-blue-100 text-sm">Humidity</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Wind className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {latestReading?.gas || 0}
            </div>
            <div className="text-orange-100 text-sm">Gas Level</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 opacity-80" />
              <CheckCircle className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {latestReading?.time || 0}
            </div>
            <div className="text-green-100 text-sm">Timestamp</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Temperature Chart */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Thermometer className="w-5 h-5 mr-2 text-red-400" />
              Temperature Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#temperatureGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Humidity Chart */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Droplets className="w-5 h-5 mr-2 text-blue-400" />
              Humidity Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="humidity"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#humidityGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sensor Logs Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-400" />
            Recent Sensor Readings
          </h3>
          {sensorLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Temperature</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Humidity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Gas Level</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sensorLogs.slice(-8).reverse().map((log, index) => {
                    const sensorLog = log as SensorReading;
                    return (
                      <tr key={sensorLog.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-white">{sensorLog.time}</td>
                        <td className="px-4 py-3 text-sm text-white">
                          <span className="flex items-center">
                            <Thermometer className="w-4 h-4 mr-1 text-red-400" />
                            {sensorLog.temperature}°C
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          <span className="flex items-center">
                            <Droplets className="w-4 h-4 mr-1 text-blue-400" />
                            {sensorLog.humidity}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          <span className="flex items-center">
                            <Wind className="w-4 h-4 mr-1 text-orange-400" />
                            {sensorLog.gas}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              {logsLoading ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                  Loading sensor data...
                </div>
              ) : (
                'No sensor data available'
              )}
            </div>
          )}
        </div>

        {/* System Metrics */}
        {dashboardData?.metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5 opacity-60" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {dashboardData.metrics.users?.toLocaleString() || 0}
              </div>
              <div className="text-indigo-100 text-sm">Active Users</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5 opacity-60" />
              </div>
              <div className="text-3xl font-bold mb-1">
                ${dashboardData.metrics.revenue?.toLocaleString() || 0}
              </div>
              <div className="text-emerald-100 text-sm">Revenue</div>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <ShoppingCart className="w-8 h-8 opacity-80" />
                <TrendingUp className="w-5 h-5 opacity-60" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {dashboardData.metrics.orders?.toLocaleString() || 0}
              </div>
              <div className="text-pink-100 text-sm">Orders</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-white text-lg font-semibold mb-4">Dashboard Controls</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleUpdateData}
              disabled={isRefreshing}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Update Dashboard Data
            </button>
            <button
              onClick={handleTestConnection}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              <Activity className="w-4 h-4 mr-2" />
              Test Firebase Connection
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            Monitor your IoT sensors in real-time. Data updates automatically when new readings are received.
          </p>
        </div>
      </div>
    </div>
  );
}