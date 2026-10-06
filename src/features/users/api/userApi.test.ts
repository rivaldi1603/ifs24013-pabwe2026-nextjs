import { describe, it, expect, vi } from 'vitest';
import { getUsersApi, getProfileApi, updateProfileApi, updateProfilePhotoApi, updateProfilePasswordApi } from '../api/userApi';
import * as apiHelper from '../../../helpers/apiHelper';

vi.mock('../../../helpers/apiHelper', () => ({
  fetchApi: vi.fn(),
}));

describe('userApi', () => {
  it('should call fetchApi for getUsersApi', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    await getUsersApi('test');
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users', expect.objectContaining({
      method: 'GET',
      params: { search: 'test' },
    }));
  });

  it('should call fetchApi for getUsersApi without search', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    await getUsersApi();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users', expect.objectContaining({
      method: 'GET',
      params: undefined,
    }));
  });

  it('should call fetchApi for getProfileApi', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    await getProfileApi();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users/me', expect.objectContaining({
      method: 'GET',
    }));
  });

  it('should call fetchApi for updateProfileApi', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    await updateProfileApi({ name: 'Test' });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users/me', expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify({ name: 'Test' }),
    }));
  });

  it('should call fetchApi for updateProfilePhotoApi', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    const file = new File([''], 'test.png', { type: 'image/png' });
    await updateProfilePhotoApi(file);
    
    // Expect body to be FormData
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users/me/photo', expect.objectContaining({
      method: 'POST',
      body: expect.any(FormData),
    }));
  });

  it('should call fetchApi for updateProfilePasswordApi', async () => {
    (apiHelper.fetchApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    await updateProfilePasswordApi({ old_password: '123', new_password: '456' });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/users/me/password', expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify({ old_password: '123', new_password: '456' }),
    }));
  });
});
