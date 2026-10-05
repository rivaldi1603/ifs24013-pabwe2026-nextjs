import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi } from '../api/authApi';
import { putAccessToken, removeAccessToken } from '../../../helpers/apiHelper';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';

export const asyncAuthLogin = createAsyncThunk(
  'auth/login',
  async (payload: any, { rejectWithValue }) => {
    try {
      const { response, data } = await loginApi(payload);
      if (!response.ok) {
        showErrorDialog('Login Gagal', data.message || 'Terjadi kesalahan');
        return rejectWithValue(data.message);
      }
      
      // Assume data contains a token property. If it's data.data.token, adjust accordingly.
      const token = data.data?.token || data.token;
      if (token) {
        putAccessToken(token);
      }
      
      showSuccessDialog('Login Berhasil', 'Selamat datang!');
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncAuthRegister = createAsyncThunk(
  'auth/register',
  async (payload: any, { rejectWithValue }) => {
    try {
      const { response, data } = await registerApi(payload);
      if (!response.ok) {
        showErrorDialog('Registrasi Gagal', data.message || 'Terjadi kesalahan');
        return rejectWithValue(data.message);
      }
      showSuccessDialog('Registrasi Berhasil', 'Silakan login menggunakan akun baru Anda.');
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncAuthLogout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      removeAccessToken();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
