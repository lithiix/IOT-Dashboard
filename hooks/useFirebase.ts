'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, off, set, push, update, remove } from 'firebase/database';
import { useFirebase } from '@/contexts/FirebaseContext';

export function useRealtimeData(path: string) {
  const { database } = useFirebase();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [database, path]);

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
  const { database } = useFirebase();

  const writeData = async (path: string, data: any) => {
    try {
      const dataRef = ref(database, path);
      await set(dataRef, data);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const pushData = async (path: string, data: any) => {
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
    try {
      const dataRef = ref(database, path);
      await update(dataRef, data);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const deleteData = async (path: string) => {
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