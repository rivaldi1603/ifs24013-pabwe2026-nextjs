import { describe, it, expect, vi } from 'vitest';
import { loginApi, registerApi } from '../api/authApi';
import * as apiHelper from '../../../helpers/apiHelper';

vi.mock('../../../helpers/apiHelper', () => ({
  fetchApi: vi.fn(),
}));

describe('authApi', () => {
  it('should call fetchApi for loginApi', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    await loginApi({ email: 'test@test.com', password: 'password' });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/auth/login', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
      requiresAuth: false,
    }));
  });

  it('should call fetchApi for registerApi', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    await registerApi({ name: 'Test', email: 'test@test.com', password: 'password' });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/auth/register', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ name: 'Test', email: 'test@test.com', password: 'password' }),
      requiresAuth: false,
    }));
  });
});
