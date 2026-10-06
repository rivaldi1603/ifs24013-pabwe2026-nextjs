import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  asyncGetUsers, asyncGetProfile, asyncUpdateProfile, 
  asyncUpdateProfilePhoto, asyncUpdateProfilePassword 
} from '../states/action';
import * as userApi from '../api/userApi';
import * as toolsHelper from '../../../helpers/toolsHelper';
import * as reducer from '../states/reducer';

vi.mock('../api/userApi', () => ({
  getUsersApi: vi.fn(),
  getProfileApi: vi.fn(),
  updateProfileApi: vi.fn(),
  updateProfilePhotoApi: vi.fn(),
  updateProfilePasswordApi: vi.fn(),
}));

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('Users Actions', () => {
  let dispatch: any;

  beforeEach(() => {
    dispatch = vi.fn();
    vi.clearAllMocks();
  });

  describe('asyncGetUsers', () => {
    it('should fetch users successfully', async () => {
      (userApi.getUsersApi as any).mockResolvedValue({ response: { ok: true }, data: { data: { users: [{ id: 1 }] } } });
      const action = asyncGetUsers();
      const result = await action(dispatch);
      expect(result).toEqual([{ id: 1 }]);
      expect(dispatch).toHaveBeenCalledWith(reducer.setUsers([{ id: 1 }] as any));
    });

    it('should handle fetch users failure', async () => {
      (userApi.getUsersApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncGetUsers();
      await expect(action(dispatch)).rejects.toThrow('Error');
      expect(toolsHelper.showErrorDialog).toHaveBeenCalled();
    });
  });

  describe('asyncGetProfile', () => {
    it('should fetch profile successfully', async () => {
      (userApi.getProfileApi as any).mockResolvedValue({ response: { ok: true }, data: { data: { user: { id: 1 } } } });
      const action = asyncGetProfile();
      const result = await action(dispatch);
      expect(result).toEqual({ id: 1 });
      expect(dispatch).toHaveBeenCalledWith(reducer.setProfile({ id: 1 } as any));
    });

    it('should handle fetch profile failure without dialog', async () => {
      (userApi.getProfileApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncGetProfile();
      await expect(action(dispatch)).rejects.toThrow('Error');
      expect(toolsHelper.showErrorDialog).not.toHaveBeenCalled();
    });
  });

  describe('asyncUpdateProfile', () => {
    it('should update profile and dispatch refresh', async () => {
      (userApi.updateProfileApi as any).mockResolvedValue({ response: { ok: true }, data: { success: true } });
      const action = asyncUpdateProfile({ name: 'Test' });
      await action(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });

    it('should handle update error', async () => {
      (userApi.updateProfileApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncUpdateProfile({ name: 'Test' });
      await expect(action(dispatch)).rejects.toThrow('Error');
      expect(toolsHelper.showErrorDialog).toHaveBeenCalled();
    });
  });

  describe('asyncUpdateProfilePhoto', () => {
    it('should update photo and dispatch refresh', async () => {
      (userApi.updateProfilePhotoApi as any).mockResolvedValue({ response: { ok: true }, data: { success: true } });
      const action = asyncUpdateProfilePhoto(new File([''], ''));
      await action(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });

    it('should handle photo error', async () => {
      (userApi.updateProfilePhotoApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncUpdateProfilePhoto(new File([''], ''));
      await expect(action(dispatch)).rejects.toThrow('Error');
      expect(toolsHelper.showErrorDialog).toHaveBeenCalled();
    });
  });

  describe('asyncUpdateProfilePassword', () => {
    it('should update password successfully', async () => {
      (userApi.updateProfilePasswordApi as any).mockResolvedValue({ response: { ok: true }, data: { success: true } });
      const action = asyncUpdateProfilePassword({ old: '1', new: '2' });
      await action(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });

    it('should handle password error', async () => {
      (userApi.updateProfilePasswordApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncUpdateProfilePassword({ old: '1', new: '2' });
      await expect(action(dispatch)).rejects.toThrow('Error');
      expect(toolsHelper.showErrorDialog).toHaveBeenCalled();
    });
  });
});
