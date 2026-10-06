import { describe, it, expect, vi, beforeEach } from 'vitest';
import { asyncAuthLogin, asyncAuthRegister, asyncAuthLogout } from '../states/action';
import * as authApi from '../api/authApi';
import * as apiHelper from '../../../helpers/apiHelper';
import * as toolsHelper from '../../../helpers/toolsHelper';
import * as reducer from '../states/reducer';

vi.mock('../api/authApi', () => ({
  loginApi: vi.fn(),
  registerApi: vi.fn(),
}));

vi.mock('../../../helpers/apiHelper', () => ({
  putAccessToken: vi.fn(),
  removeAccessToken: vi.fn(),
}));

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('Auth Actions', () => {
  let dispatch: any;

  beforeEach(() => {
    dispatch = vi.fn();
    vi.clearAllMocks();
  });

  describe('asyncAuthLogin', () => {
    it('should handle successful login', async () => {
      (authApi.loginApi as any).mockResolvedValue({
        response: { ok: true },
        data: { data: { token: 'test-token' } }
      });

      const action = asyncAuthLogin({ email: 'test@test.com', password: 'password' });
      const result = await action(dispatch);
      
      expect(apiHelper.putAccessToken).toHaveBeenCalledWith('test-token');
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
      expect(result).toEqual({ data: { token: 'test-token' } });
      expect(dispatch).toHaveBeenCalledWith(reducer.setIsAuthLogin(true));
      expect(dispatch).toHaveBeenCalledWith(reducer.setIsAuthLogin(false));
    });

    it('should handle successful login with fallback token', async () => {
      (authApi.loginApi as any).mockResolvedValue({
        response: { ok: true },
        data: { token: 'fallback-token' }
      });

      const action = asyncAuthLogin({ email: 'test@test.com', password: 'password' });
      const result = await action(dispatch);
      
      expect(apiHelper.putAccessToken).toHaveBeenCalledWith('fallback-token');
    });

    it('should handle failed login API response', async () => {
      (authApi.loginApi as any).mockResolvedValue({
        response: { ok: false },
        data: { message: 'Invalid credentials' }
      });

      const action = asyncAuthLogin({ email: 'test@test.com', password: 'password' });
      await expect(action(dispatch)).rejects.toThrow('Invalid credentials');
      
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Login Gagal', 'Invalid credentials');
    });

    it('should handle failed login API response with default message', async () => {
      (authApi.loginApi as any).mockResolvedValue({
        response: { ok: false },
        data: {}
      });

      const action = asyncAuthLogin({ email: 'test@test.com', password: 'password' });
      await expect(action(dispatch)).rejects.toThrow();
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Login Gagal', 'Terjadi kesalahan');
    });

    it('should handle API exception during login', async () => {
      (authApi.loginApi as any).mockRejectedValue(new Error('Network error'));

      const action = asyncAuthLogin({ email: 'test@test.com', password: 'password' });
      await expect(action(dispatch)).rejects.toThrow('Network error');
      
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Error', 'Network error');
    });
  });

  describe('asyncAuthRegister', () => {
    it('should handle successful registration', async () => {
      (authApi.registerApi as any).mockResolvedValue({
        response: { ok: true },
        data: { success: true }
      });

      const action = asyncAuthRegister({ name: 'Test', email: 'test@test.com', password: 'password' });
      const result = await action(dispatch);
      
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it('should handle failed registration API response', async () => {
      (authApi.registerApi as any).mockResolvedValue({
        response: { ok: false },
        data: { message: 'Email already exists' }
      });

      const action = asyncAuthRegister({ name: 'Test', email: 'test@test.com', password: 'password' });
      await expect(action(dispatch)).rejects.toThrow('Email already exists');
      
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Registrasi Gagal', 'Email already exists');
    });

    it('should handle failed registration API response with default message', async () => {
      (authApi.registerApi as any).mockResolvedValue({
        response: { ok: false },
        data: {}
      });

      const action = asyncAuthRegister({ name: 'Test', email: 'test@test.com', password: 'password' });
      await expect(action(dispatch)).rejects.toThrow();
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Registrasi Gagal', 'Terjadi kesalahan');
    });
  });

  describe('asyncAuthLogout', () => {
    it('should handle logout successfully', async () => {
      const action = asyncAuthLogout();
      const result = await action(dispatch);
      
      expect(apiHelper.removeAccessToken).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should handle logout error', async () => {
      (apiHelper.removeAccessToken as any).mockImplementation(() => {
        throw new Error('Logout failed');
      });
      const action = asyncAuthLogout();
      await expect(action(dispatch)).rejects.toThrow('Logout failed');
    });
  });
});
