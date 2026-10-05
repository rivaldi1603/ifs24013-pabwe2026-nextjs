import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchApi, getAccessToken, putAccessToken, removeAccessToken } from '../helpers/apiHelper';
import { DELCOM_BASEURL } from '../lib/config';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch
global.fetch = vi.fn();

describe('apiHelper', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('Token Management', () => {
    it('should store token using putAccessToken', () => {
      putAccessToken('test-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'test-token');
      expect(localStorageMock.getItem('accessToken')).toBe('test-token');
    });

    it('should retrieve token using getAccessToken', () => {
      localStorageMock.setItem('accessToken', 'token-123');
      const token = getAccessToken();
      expect(token).toBe('token-123');
    });

    it('should remove token using removeAccessToken', () => {
      localStorageMock.setItem('accessToken', 'token-123');
      removeAccessToken();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
      expect(getAccessToken()).toBeNull();
    });

    it('should handle getAccessToken when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      expect(getAccessToken()).toBeNull();
      global.window = originalWindow;
    });

    it('should handle putAccessToken when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      expect(() => putAccessToken('token')).not.toThrow();
      global.window = originalWindow;
    });
    
    it('should handle removeAccessToken when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      expect(() => removeAccessToken()).not.toThrow();
      global.window = originalWindow;
    });
  });

  describe('fetchApi', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValue({
        json: vi.fn().mockResolvedValue({ success: true }),
      });
    });

    it('should fetch with default GET method and json content type', async () => {
      await fetchApi('/test', { requiresAuth: false });
      expect(global.fetch).toHaveBeenCalledWith(
        `${DELCOM_BASEURL}/test`,
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should include bearer token if requiresAuth is true', async () => {
      putAccessToken('my-token');
      await fetchApi('/test');
      expect(global.fetch).toHaveBeenCalledWith(
        `${DELCOM_BASEURL}/test`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer my-token',
          }),
        })
      );
    });

    it('should append query parameters correctly', async () => {
      await fetchApi('/test', { requiresAuth: false, params: { a: '1', b: '2' } });
      expect(global.fetch).toHaveBeenCalledWith(
        `${DELCOM_BASEURL}/test?a=1&b=2`,
        expect.any(Object)
      );
    });

    it('should not set Content-Type if body is FormData', async () => {
      const formData = new FormData();
      formData.append('file', new Blob());
      await fetchApi('/test', { requiresAuth: false, method: 'POST', body: formData });
      
      const fetchCall = (global.fetch as any).mock.calls[0];
      const headers = fetchCall[1].headers;
      expect(headers['Content-Type']).toBeUndefined();
    });
    
    it('should handle fetch errors gracefully', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));
      await expect(fetchApi('/test', { requiresAuth: false })).rejects.toThrow('Network error');
    });
  });
});
