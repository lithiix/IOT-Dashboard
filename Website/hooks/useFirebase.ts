'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';

/**
 * Custom Hook for fetching data from GravityCore PHP REST API backend.
 * Polled every 5 seconds for real-time synchronization.
 */
export function useRealtimeData(path: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      if (path.includes('dashboard') || path === 'index') {
        const res = await apiClient.getStatus();
        setData({
          lastUpdated: new Date().toISOString(),
          status: res.status || 'active',
          metrics: {
            totalDevices: res.metrics?.total_devices ?? 3,
            totalReadings: res.metrics?.total_logs ?? 10,
            activeAlerts: 0
          }
        });
      } else if (path.includes('logs')) {
        const res = await apiClient.getLogs(30);
        const logsMap: Record<string, any> = {};
        (res.data || []).forEach((item: any) => {
          const key = `log_${item.id}`;
          logsMap[key] = {
            id: key,
            ph: parseFloat(item.ph ?? 7.2),
            ec: parseFloat(item.ec ?? 450),
            oxygen: parseFloat(item.oxygen ?? 8.2),
            waterTemp: parseFloat(item.water_temp ?? item.temperature ?? 22.5),
            envTemp: parseFloat(item.env_temp ?? item.temperature ?? 26.8),
            envHumidity: parseFloat(item.env_humidity ?? item.humidity ?? 62),
            time: new Date(item.recorded_at).getTime()
          };
        });
        
        if (path.includes('lionbit')) {
          setData(logsMap);
        } else {
          setData(logsMap);
        }
      } else if (path.includes('devices')) {
        const res = await apiClient.getDevices();
        const devicesMap: Record<string, any> = {};
        (res.data || []).forEach((dev: any) => {
          devicesMap[dev.device_code || dev.id] = {
            id: dev.device_code || dev.id,
            deviceId: dev.device_code,
            name: dev.device_name,
            model: dev.model || 'Gravity Sensor Unit v3',
            status: dev.status || 'online',
            location: dev.location || 'Greenhouse',
            registeredAt: dev.created_at
          };
        });
        setData(devicesMap);
      } else {
        // General status or fallback
        const res = await apiClient.getStatus();
        setData(res);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'API Connection Error');
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useRealtimeList(path: string) {
  const { data, loading, error } = useRealtimeData(path);

  const list = data
    ? Object.entries(data).map(([key, value]) => ({
        id: key,
        ...(value as Record<string, any>)
      }))
    : [];

  return { list, loading, error };
}

export function useFirebaseMutation() {
  const writeData = async (path: string, data: any) => {
    try {
      if (path.includes('devices')) {
        await apiClient.createDevice(data);
      } else if (path.includes('logs')) {
        await apiClient.postLog(data);
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const pushData = async (path: string, data: any) => {
    try {
      if (path.includes('logs')) {
        const res = await apiClient.postLog(data);
        return { success: true, key: res.log_id };
      } else if (path.includes('devices')) {
        const res = await apiClient.createDevice(data);
        return { success: true, key: res.device_id };
      }
      return { success: true, key: 'api-push-' + Date.now() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateData = async (path: string, data: any) => {
    try {
      await apiClient.updateDevice(data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteData = async (path: string) => {
    try {
      const parts = path.split('/');
      const id = parts[parts.length - 1];
      await apiClient.deleteDevice(id);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return { writeData, pushData, updateData, deleteData };
}