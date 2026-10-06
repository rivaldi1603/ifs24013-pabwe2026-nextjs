import { loginApi, registerApi } from '../api/authApi';
import { putAccessToken, removeAccessToken } from '../../../helpers/apiHelper';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';
import { setIsAuthLogin, setIsAuthRegister, setIsAuthLogout } from './reducer';
import type { AppDispatch } from '../../../store';

export function asyncAuthLogin(payload: any) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsAuthLogin(true));
    try {
      const { response, data } = await loginApi(payload);
      if (!response.ok) {
        showErrorDialog('Login Gagal', data.message || 'Terjadi kesalahan');
        throw new Error(data.message);
      }
      
      const token = data.data?.token || data.token;
      if (token) {
        putAccessToken(token);
      }
      
      showSuccessDialog('Login Berhasil', 'Selamat datang!');
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      throw error;
    } finally {
      dispatch(setIsAuthLogin(false));
    }
  };
}

export function asyncAuthRegister(payload: any) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsAuthRegister(true));
    try {
      const { response, data } = await registerApi(payload);
      if (!response.ok) {
        showErrorDialog('Registrasi Gagal', data.message || 'Terjadi kesalahan');
        throw new Error(data.message);
      }
      showSuccessDialog('Registrasi Berhasil', 'Silakan login menggunakan akun baru Anda.');
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      throw error;
    } finally {
      dispatch(setIsAuthRegister(false));
    }
  };
}

export function asyncAuthLogout() {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsAuthLogout(true));
    try {
      removeAccessToken();
      return true;
    } catch (error: any) {
      throw error;
    } finally {
      dispatch(setIsAuthLogout(false));
    }
  };
}
