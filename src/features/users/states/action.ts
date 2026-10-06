import { 
  getUsersApi, 
  getProfileApi, 
  updateProfileApi, 
  updateProfilePhotoApi, 
  updateProfilePasswordApi 
} from '../api/userApi';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';
import { 
  setUsers, 
  setProfile, 
  setIsProfile, 
  setIsChangeProfile, 
  setIsChangeProfilePhoto, 
  setIsChangeProfilePassword 
} from './reducer';
import type { AppDispatch } from '../../../store';

export function asyncGetUsers(search?: string) {
  return async (dispatch: AppDispatch) => {
    try {
      const { response, data } = await getUsersApi(search);
      if (!response.ok) {
        showErrorDialog('Gagal mengambil data', data.message);
        throw new Error(data.message);
      }
      dispatch(setUsers(data.data.users || []));
      return data.data.users;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      throw error;
    }
  };
}

export function asyncGetProfile() {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsProfile(true));
    try {
      const { response, data } = await getProfileApi();
      if (!response.ok) {
        throw new Error(data.message);
      }
      dispatch(setProfile(data.data.user));
      return data.data.user;
    } catch (error: any) {
      dispatch(setProfile(null));
      throw error;
    } finally {
      dispatch(setIsProfile(false));
    }
  };
}

export function asyncUpdateProfile(payload: any) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsChangeProfile(true));
    try {
      const { response, data } = await updateProfileApi(payload);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        throw new Error(data.message);
      }
      showSuccessDialog('Berhasil', 'Profil berhasil diperbarui');
      dispatch(asyncGetProfile() as any);
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      throw error;
    } finally {
      dispatch(setIsChangeProfile(false));
    }
  };
}

export function asyncUpdateProfilePhoto(file: File) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsChangeProfilePhoto(true));
    try {
      const { response, data } = await updateProfilePhotoApi(file);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        throw new Error(data.message);
      }
      showSuccessDialog('Berhasil', 'Foto profil berhasil diperbarui');
      dispatch(asyncGetProfile() as any);
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      throw error;
    } finally {
      dispatch(setIsChangeProfilePhoto(false));
    }
  };
}

export function asyncUpdateProfilePassword(payload: any) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsChangeProfilePassword(true));
    try {
      const { response, data } = await updateProfilePasswordApi(payload);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        throw new Error(data.message);
      }
      showSuccessDialog('Berhasil', 'Kata sandi berhasil diperbarui');
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      throw error;
    } finally {
      dispatch(setIsChangeProfilePassword(false));
    }
  };
}
