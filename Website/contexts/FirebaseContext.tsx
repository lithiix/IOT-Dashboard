'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';

interface ApiContextType {
  isConnected: boolean;
  isDemo: boolean;
  apiStatus: any;
  refreshStatus: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [apiStatus, setApiStatus] = useState<any>(null);

  const refreshStatus = async () => {
    try {
      const res = await apiClient.getStatus();
      setApiStatus(res);
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ApiContext.Provider value={{ isConnected, isDemo: false, apiStatus, refreshStatus }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(ApiContext);
  if (!context) {
    return { isConnected: true, isDemo: false, apiStatus: null, refreshStatus: async () => {} };
  }
  return context;
}