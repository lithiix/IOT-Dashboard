'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, off, set, push, update, remove } from 'firebase/database';
import { useFirebase } from '@/contexts/FirebaseContext';
import { isFirebaseConfigured } from '@/lib/firebase';

// Shared mock database state for demo mode
const mockDatabaseState: any = {
  dashboard: {
    lastUpdated: new Date().toISOString(),
    status: 'active',
    metrics: {
      totalDevices: 1,
      totalReadings: 8,
      activeAlerts: 0
    }
  },
  lionbit: {
    device01: {
      logs: {
        "-OkXCiWQhcGEOwy7FpwQ": { ph: 7.2, ec: 450, oxygen: 8.2, waterTemp: 22.4, envTemp: 26.8, envHumidity: 62, time: 6364 },
        "-OkXCiWQhcGEOwy7FpwR": { ph: 7.1, ec: 460, oxygen: 8.1, waterTemp: 22.5, envTemp: 27.0, envHumidity: 61, time: 6365 },
        "-OkXCiWQhcGEOwy7FpwS": { ph: 7.3, ec: 445, oxygen: 8.3, waterTemp: 22.3, envTemp: 26.5, envHumidity: 63, time: 6366 },
        "-OkXCiWQhcGEOwy7FpwT": { ph: 7.2, ec: 455, oxygen: 8.2, waterTemp: 22.6, envTemp: 26.9, envHumidity: 62, time: 6367 },
        "-OkXCiWQhcGEOwy7FpwU": { ph: 7.4, ec: 440, oxygen: 8.4, waterTemp: 22.2, envTemp: 26.4, envHumidity: 64, time: 6368 },
        "-OkXCiWQhcGEOwy7FpwV": { ph: 7.3, ec: 465, oxygen: 8.0, waterTemp: 22.7, envTemp: 27.2, envHumidity: 60, time: 6369 },
        "-OkXCiWQhcGEOwy7FpwW": { ph: 7.1, ec: 450, oxygen: 8.1, waterTemp: 22.4, envTemp: 26.7, envHumidity: 62, time: 6370 },
        "-OkXCiWQhcGEOwy7FpwX": { ph: 7.2, ec: 450, oxygen: 8.2, waterTemp: 22.5, envTemp: 26.8, envHumidity: 63, time: 6371 }
      }
    }
  }
};

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach(l => l());
}

function getValueByPath(obj: any, path: string): any {
  const parts = path.split('/');
  let current = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return null;
    current = current[part];
  }
  return current;
}

function setValueByPath(obj: any, path: string, value: any): void {
  const parts = path.split('/');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

function updateValueByPath(obj: any, path: string, value: any): void {
  const parts = path.split('/');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) {
      current[part] = {};
    }
    current = current[part];
  }
  const lastPart = parts[parts.length - 1];
  if (typeof current[lastPart] === 'object' && current[lastPart] !== null && typeof value === 'object' && value !== null) {
    current[lastPart] = { ...current[lastPart], ...value };
  } else {
    current[lastPart] = value;
  }
}

function deleteValueByPath(obj: any, path: string): void {
  const parts = path.split('/');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) return;
    current = current[part];
  }
  delete current[parts[parts.length - 1]];
}

// Generate randomized but smooth sensor data telemetry
function simulateNewData() {
  const logsObj = mockDatabaseState.lionbit.device01.logs;
  const logsKeys = Object.keys(logsObj);
  
  let lastLog = { ph: 7.2, ec: 450, oxygen: 8.2, waterTemp: 22.5, envTemp: 26.8, envHumidity: 63, time: 6371 };
  if (logsKeys.length > 0) {
    const sortedLogs = Object.values(logsObj).sort((a: any, b: any) => a.time - b.time);
    lastLog = sortedLogs[sortedLogs.length - 1] as any;
  }
  
  const nextTime = lastLog.time + 1;
  
  // Fluctuate pH (-0.1 to 0.1) clamped between 6.0 and 8.5
  const phChange = (Math.random() - 0.5) * 0.2;
  const nextPh = Math.round((Math.max(6.0, Math.min(8.5, lastLog.ph + phChange))) * 10) / 10;
  
  // Fluctuate EC (-20 to 20) clamped between 100 and 1500
  const ecChange = (Math.random() - 0.5) * 40;
  const nextEc = Math.round(Math.max(100, Math.min(1500, lastLog.ec + ecChange)));
  
  // Fluctuate Oxygen Concentration (-0.2 to 0.2) clamped between 5.0 and 12.0
  const oxyChange = (Math.random() - 0.5) * 0.4;
  const nextOxy = Math.round((Math.max(5.0, Math.min(12.0, lastLog.oxygen + oxyChange))) * 10) / 10;
  
  // Fluctuate Water Temperature (-0.3 to 0.3) clamped between 15.0 and 30.0
  const waterTempChange = (Math.random() - 0.5) * 0.6;
  const nextWaterTemp = Math.round((Math.max(15.0, Math.min(30.0, lastLog.waterTemp + waterTempChange))) * 10) / 10;
  
  // Fluctuate Environment Temperature (-0.4 to 0.4) clamped between 18.0 and 40.0
  const envTempChange = (Math.random() - 0.5) * 0.8;
  const nextEnvTemp = Math.round((Math.max(18.0, Math.min(40.0, lastLog.envTemp + envTempChange))) * 10) / 10;
  
  // Fluctuate Environment Humidity (-2 to 2) clamped between 40 and 90
  const envHumChange = (Math.random() - 0.5) * 4;
  const nextEnvHum = Math.round(Math.max(40, Math.min(90, lastLog.envHumidity + envHumChange)));
  
  const nextId = "mock-log-" + Math.random().toString(36).substring(2, 11);
  
  mockDatabaseState.lionbit.device01.logs[nextId] = {
    ph: nextPh,
    ec: nextEc,
    oxygen: nextOxy,
    waterTemp: nextWaterTemp,
    envTemp: nextEnvTemp,
    envHumidity: nextEnvHum,
    time: nextTime
  };
  
  // Update dashboard status
  mockDatabaseState.dashboard.lastUpdated = new Date().toISOString();
  
  const allLogs = Object.values(mockDatabaseState.lionbit.device01.logs);
  mockDatabaseState.dashboard.metrics.totalReadings = allLogs.length;
  // Count readings outside healthy parameters (e.g. pH < 6.5/pH > 8.0, dissolved oxygen < 6.0) as alerts
  const alertsCount = allLogs.filter((log: any) => log.ph < 6.5 || log.ph > 8.0 || log.oxygen < 6.0).length;
  mockDatabaseState.dashboard.metrics.activeAlerts = alertsCount;
  
  notifyListeners();
}

// Start simulation on client side in demo mode
if (typeof window !== 'undefined' && !isFirebaseConfigured) {
  setInterval(() => {
    simulateNewData();
  }, 5000);
}

export function useRealtimeData(path: string) {
  const { database, isDemo } = useFirebase();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemo) {
      setLoading(true);
      const handleUpdate = () => {
        setData(getValueByPath(mockDatabaseState, path));
        setLoading(false);
      };
      
      handleUpdate();
      listeners.add(handleUpdate);
      
      return () => {
        listeners.delete(handleUpdate);
      };
    }

    if (!database || !path) return;

    const dataRef = ref(database, path);
    setLoading(true);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      setData(snapshot.val());
      setLoading(false);
      setError(null);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => {
      off(dataRef);
    };
  }, [database, path, isDemo]);

  return { data, loading, error };
}

export function useRealtimeList(path: string) {
  const { data, loading, error } = useRealtimeData(path);

  const list = data ? Object.entries(data).map(([key, value]) => ({
    id: key,
    ...(value as Record<string, any>)
  })) : [];

  return { list, loading, error };
}

export function useFirebaseMutation() {
  const { database, isDemo } = useFirebase();

  const writeData = async (path: string, data: any) => {
    if (isDemo) {
      setValueByPath(mockDatabaseState, path, data);
      notifyListeners();
      return { success: true };
    }
    try {
      const dataRef = ref(database, path);
      await set(dataRef, data);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const pushData = async (path: string, data: any) => {
    if (isDemo) {
      const newKey = "mock-push-" + Math.random().toString(36).substring(2, 11);
      setValueByPath(mockDatabaseState, `${path}/${newKey}`, data);
      notifyListeners();
      return { success: true, key: newKey };
    }
    try {
      const dataRef = ref(database, path);
      const newRef = push(dataRef);
      await set(newRef, data);
      return { success: true, key: newRef.key };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const updateData = async (path: string, data: any) => {
    if (isDemo) {
      updateValueByPath(mockDatabaseState, path, data);
      notifyListeners();
      return { success: true };
    }
    try {
      const dataRef = ref(database, path);
      await update(dataRef, data);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const deleteData = async (path: string) => {
    if (isDemo) {
      deleteValueByPath(mockDatabaseState, path);
      notifyListeners();
      return { success: true };
    }
    try {
      const dataRef = ref(database, path);
      await remove(dataRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  return { writeData, pushData, updateData, deleteData };
}