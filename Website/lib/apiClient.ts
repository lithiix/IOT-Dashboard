/**
 * GravityCore API Client
 * Connects the Website frontend to the PHP REST API backend.
 */

// Primary API target: Local PHP dev server on port 8000 or custom env URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function apiFetch<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const primaryUrl = `${API_BASE_URL}/${cleanEndpoint}`;
  
  try {
    const response = await fetch(primaryUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (primaryError: any) {
    // If primary fetch fails (e.g. port mismatch), try secondary relative /api endpoint or localhost fallback
    if (primaryUrl.includes('127.0.0.1:8000')) {
      try {
        const fallbackUrl = `http://localhost/api/${cleanEndpoint}`;
        const fallbackResponse = await fetch(fallbackUrl, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(options?.headers || {}),
          },
        });
        const fallbackData = await fallbackResponse.json();
        if (!fallbackResponse.ok) {
          throw new Error(fallbackData.message || `API error: ${fallbackResponse.status}`);
        }
        return fallbackData;
      } catch (fallbackError) {
        throw new Error(primaryError.message || 'Failed to fetch from PHP REST API server.');
      }
    }
    throw primaryError;
  }
}

export const apiClient = {
  // Get API Status & Metrics
  getStatus: () => apiFetch('index.php'),

  // Super Admin Authentication & Profile
  login: (email: string, password: string) => 
    apiFetch('login.php', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getAdminProfile: () => apiFetch('user_profile.php'),
  updateAdminProfile: (data: any) => 
    apiFetch('user_profile.php', { method: 'POST', body: JSON.stringify(data) }),

  // Devices
  getDevices: () => apiFetch('devices.php'),
  getDevice: (id: string | number) => apiFetch(`devices.php?id=${id}`),
  createDevice: (device: any) => apiFetch('devices.php', { method: 'POST', body: JSON.stringify(device) }),
  updateDevice: (device: any) => apiFetch('devices.php', { method: 'PUT', body: JSON.stringify(device) }),
  deleteDevice: (id: string | number) => apiFetch('devices.php', { method: 'DELETE', body: JSON.stringify({ id }) }),

  // Sensor Telemetry Logs
  getLogs: (limit = 30, deviceId?: number) => {
    const query = deviceId ? `limit=${limit}&device_id=${deviceId}` : `limit=${limit}`;
    return apiFetch(`logs.php?${query}`);
  },
  postLog: (logData: any) => apiFetch('logs.php', { method: 'POST', body: JSON.stringify(logData) }),
};
