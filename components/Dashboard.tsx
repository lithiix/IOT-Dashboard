'use client';

import { useState, useEffect, useRef } from 'react';
import { useRealtimeData, useRealtimeList, useFirebaseMutation } from '@/hooks/useFirebase';
import { useFirebase } from '@/contexts/FirebaseContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  FlaskConical,
  Zap,
  Waves,
  Thermometer,
  Sun,
  Droplets,
  Activity,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

interface SensorReading {
  id: string;
  ph: number;
  ec: number;
  oxygen: number;
  waterTemp: number;
  envTemp: number;
  envHumidity: number;
  time: number;
}

export default function Dashboard() {
  const { isDemo } = useFirebase();
  const { data: dashboardData, loading, error } = useRealtimeData('dashboard');
  const { list: sensorLogs, loading: logsLoading } = useRealtimeList('lionbit/device01/logs');
  const { writeData } = useFirebaseMutation();
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [lastDataUpdate, setLastDataUpdate] = useState<number | null>(isDemo ? Date.now() : null);
  const [pageLoadTime] = useState<number>(Date.now());
  const previousLogsCountRef = useRef<number>(0);

  // Track when NEW sensor data is added (not just page refresh)
  useEffect(() => {
    if (sensorLogs.length > 0) {
      const latest = sensorLogs[sensorLogs.length - 1] as SensorReading;
      if (latest && latest.time) {
        setLastDataUpdate(latest.time);
      } else {
        setLastDataUpdate(Date.now());
      }
      previousLogsCountRef.current = sensorLogs.length;
    }
  }, [sensorLogs.length]);

  // Monitor connection status with checking → online/offline logic
  useEffect(() => {
    const checkDeviceStatus = () => {
      const timeSincePageLoad = Date.now() - pageLoadTime;

      if (lastDataUpdate === null) {
        if (timeSincePageLoad > 60000) {
          setConnectionStatus('error');
        } else {
          setConnectionStatus('checking');
        }
      } else {
        const timeSinceLastData = Date.now() - lastDataUpdate;
        
        if (timeSinceLastData > 30000) {
          setConnectionStatus('error');
        } else if (timeSinceLastData > 10000) {
          setConnectionStatus('checking');
        } else {
          setConnectionStatus('connected');
        }
      }
    };

    checkDeviceStatus();
    const interval = setInterval(checkDeviceStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [lastDataUpdate, pageLoadTime]);

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
      ph: sensorLog.ph,
      ec: sensorLog.ec,
      oxygen: sensorLog.oxygen,
      waterTemp: sensorLog.waterTemp,
      envTemp: sensorLog.envTemp,
      envHumidity: sensorLog.envHumidity
    };
  });

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
            <div className="text-purple-300 mt-2">Connecting to Firebase Database...</div>
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
            <h1 className="text-4xl font-bold text-white mb-2">IoT Aqua & Weather Dashboard</h1>
            <p className="text-purple-300">Real-time water quality and environmental monitoring</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2">
              {getConnectionIcon()}
              <span className="text-white text-sm">
                {connectionStatus === 'connected' ? 'Device Online' :
                 connectionStatus === 'error' ? 'Device Offline' : 'Checking...'}
              </span>
            </div>
            <div className="text-right">
              <div className="text-white text-sm">Last Device Online</div>
              <div className="text-purple-300 text-xs">
                {lastDataUpdate
                  ? new Date(lastDataUpdate).toLocaleString()
                  : 'Waiting for data...'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="mb-8 bg-amber-500/10 border border-amber-500/20 backdrop-blur-md rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-300 font-semibold text-sm">Running in Demo Mode</h4>
                <p className="text-amber-400/80 text-xs mt-0.5">
                  Firebase credentials are not configured. The dashboard is currently displaying simulated live environmental and water sensor data.
                </p>
              </div>
            </div>
            <div className="text-xs text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-md font-medium border border-amber-500/30 shrink-0">
              Simulated Data Active
            </div>
          </div>
        )}

        {/* 6 Sensor Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1: pH */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <FlaskConical className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {latestReading?.ph ?? '0.0'}
            </div>
            <div className="text-indigo-100 text-sm font-medium">pH Level</div>
            <div className="text-indigo-200/70 text-xs mt-1">Water Acidity/Alkalinity</div>
          </div>

          {/* Card 2: Electrical Conductivity */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {latestReading?.ec ?? '0'} µS/cm
            </div>
            <div className="text-amber-100 text-sm font-medium">Electrical Conductivity</div>
            <div className="text-amber-200/70 text-xs mt-1">Salinity / Solute Concentration</div>
          </div>

          {/* Card 3: Oxygen Concentration */}
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Waves className="w-8 h-8 opacity-80" />
              <Activity className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {latestReading?.oxygen ?? '0.0'} mg/L
            </div>
            <div className="text-teal-100 text-sm font-medium">Oxygen Concentration</div>
            <div className="text-teal-200/70 text-xs mt-1">Dissolved O₂ Telemetry</div>
          </div>

          {/* Card 4: Water Temperature */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Thermometer className="w-8 h-8 opacity-80" />
              <Activity className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {latestReading?.waterTemp ?? '0.0'}°C
            </div>
            <div className="text-cyan-100 text-sm font-medium">Water Temperature</div>
            <div className="text-cyan-200/70 text-xs mt-1">Aquatic Ecosystem Heat</div>
          </div>

          {/* Card 5: Environment Temperature */}
          <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Sun className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {latestReading?.envTemp ?? '0.0'}°C
            </div>
            <div className="text-rose-100 text-sm font-medium">Environment Temperature</div>
            <div className="text-rose-200/70 text-xs mt-1">Ambient Air Heat</div>
          </div>

          {/* Card 6: Environment Humidity */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Droplets className="w-8 h-8 opacity-80" />
              <CheckCircle className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {latestReading?.envHumidity ?? '0'}%
            </div>
            <div className="text-blue-100 text-sm font-medium">Environment Humidity</div>
            <div className="text-blue-200/70 text-xs mt-1">Ambient Air Moisture</div>
          </div>
        </div>

        {/* Graphs Section - 6 Independent Area Charts in a Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart 1: pH Level */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-md">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <FlaskConical className="w-5 h-5 mr-2 text-indigo-400" />
              pH Level Trend
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="phGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ph"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#phGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Electrical Conductivity */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-md">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-amber-400" />
              EC (Conductivity) Trend
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="ecGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ec"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#ecGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 3: Oxygen Concentration */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-md">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Waves className="w-5 h-5 mr-2 text-teal-400" />
              Oxygen Concentration Trend
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="oxygenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="oxygen"
                  stroke="#14b8a6"
                  fillOpacity={1}
                  fill="url(#oxygenGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 4: Water Temperature */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-md">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Thermometer className="w-5 h-5 mr-2 text-cyan-400" />
              Water Temp Trend
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="waterTempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="waterTemp"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#waterTempGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 5: Environment Temperature */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-md">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Sun className="w-5 h-5 mr-2 text-rose-400" />
              Environment Temp Trend
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="envTempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="envTemp"
                  stroke="#f43f5e"
                  fillOpacity={1}
                  fill="url(#envTempGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 6: Environment Humidity */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-md">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Droplets className="w-5 h-5 mr-2 text-blue-400" />
              Environment Humidity Trend
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="envHumidityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="envHumidity"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#envHumidityGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sensor Logs Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8 shadow-lg">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-400" />
            Recent Telemetry Logs
          </h3>
          {sensorLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">pH</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">EC</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Oxygen</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Water Temp</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Env Temp</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Humidity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sensorLogs.slice(-8).reverse().map((log) => {
                    const sensorLog = log as SensorReading;
                    const isHealthy = sensorLog.ph >= 6.5 && sensorLog.ph <= 8.0 && sensorLog.oxygen >= 6.0;
                    return (
                      <tr key={sensorLog.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-white">{sensorLog.time}</td>
                        <td className="px-4 py-3 text-sm text-white">
                          <span className="flex items-center">
                            <FlaskConical className="w-4 h-4 mr-1.5 text-indigo-400" />
                            {sensorLog.ph}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          <span className="flex items-center">
                            <Zap className="w-4 h-4 mr-1.5 text-amber-400" />
                            {sensorLog.ec} µS/cm
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          <span className="flex items-center">
                            <Waves className="w-4 h-4 mr-1.5 text-teal-400" />
                            {sensorLog.oxygen} mg/L
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          <span className="flex items-center">
                            <Thermometer className="w-4 h-4 mr-1.5 text-cyan-400" />
                            {sensorLog.waterTemp}°C
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          <span className="flex items-center">
                            <Sun className="w-4 h-4 mr-1.5 text-rose-400" />
                            {sensorLog.envTemp}°C
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          <span className="flex items-center">
                            <Droplets className="w-4 h-4 mr-1.5 text-blue-400" />
                            {sensorLog.envHumidity}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isHealthy ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {isHealthy ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                                Optimal
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3 mr-1 text-amber-400" />
                                Out of Bounds
                              </>
                            )}
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
                  <RefreshCw className="w-6 h-6 animate-spin mr-2 text-purple-400" />
                  Loading telemetry logs...
                </div>
              ) : (
                'No sensor readings logged'
              )}
            </div>
          )}
        </div>

        {/* IoT System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">
              1
            </div>
            <div className="text-indigo-100 text-sm">Total Node Devices</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {sensorLogs.length}
            </div>
            <div className="text-emerald-100 text-sm">Total Telemetry Readings</div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-8 h-8 opacity-80" />
              <Activity className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {sensorLogs.filter(log => {
                const s = log as SensorReading;
                return s.ph < 6.5 || s.ph > 8.0 || s.oxygen < 6.0;
              }).length}
            </div>
            <div className="text-amber-100 text-sm">Critical Threshold Alerts</div>
            <div className="text-amber-200 text-xs opacity-80">Readings outside optimal ranges</div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-md">
          <h3 className="text-white text-lg font-semibold mb-4">Node Operations</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleTestConnection}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center cursor-pointer shadow-md"
            >
              <Activity className="w-4 h-4 mr-2" />
              Force Connection Query
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            Monitoring live environmental nodes. All telemetry is refreshed and rendered dynamically as new packages stream.
          </p>
        </div>
      </div>
    </div>
  );
}