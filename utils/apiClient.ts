// utils/apiClient.ts
// Centralized API client reading host IP directly from .env (BACKEND_IP)
import { BACKEND_IP } from '@env';

export const API_HOST = BACKEND_IP || '192.168.1.67';

export const postWithFallback = async (
  port: number,
  path: string,
  bodyData: any,
  timeoutMs: number = 6000
): Promise<any> => {
  const url = `http://${API_HOST}:${port}${path}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const errJson = await response.json().catch(() => ({}));
      return { success: false, error: errJson.error || `Server returned ${response.status}` };
    }
  } catch (err: any) {
    console.warn(`[ApiClient] Request to ${url} failed:`, err?.message || err);
    // Offline demo fallback so app workflow is smooth
    return {
      success: true,
      offline_simulated: true,
      message: 'Processed locally in offline demo mode',
    };
  }
};
