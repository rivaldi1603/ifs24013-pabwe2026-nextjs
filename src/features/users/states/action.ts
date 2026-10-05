import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getUsersApi, 
  getProfileApi, 
  updateProfileApi, 
  updateProfilePhotoApi, 
  updateProfilePasswordApi 
} from '../api/userApi';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';
import { User } from '../../../types';

export const asyncGetUsers = createAsyncThunk(
  'users/getUsers',
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const { response, data } = await getUsersApi(search);
      if (!response.ok) {
        showErrorDialog('Gagal mengambil data', data.message);
        return rejectWithValue(data.message);
      }
      return data.data; // Array of Users
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncGetProfile = createAsyncThunk(
  'users/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { response, data } = await getProfileApi();
      if (!response.ok) {
        return rejectWithValue(data.message);
      }
      return data.data; // Profile object
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncUpdateProfile = createAsyncThunk(
  'users/updateProfile',
  async (payload: any, { rejectWithValue, dispatch }) => {
    try {
      const { response, data } = await updateProfileApi(payload);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        return rejectWithValue(data.message);
      }
      showSuccessDialog('Berhasil', 'Profil berhasil diperbarui');
      dispatch(asyncGetProfile()); // Refresh profile
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncUpdateProfilePhoto = createAsyncThunk(
  'users/updateProfilePhoto',
  async (file: File, { rejectWithValue, dispatch }) => {
    try {
      const { response, data } = await updateProfilePhotoApi(file);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        return rejectWithValue(data.message);
      }
      showSuccessDialog('Berhasil', 'Foto profil berhasil diperbarui');
      dispatch(asyncGetProfile()); // Refresh profile
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncUpdateProfilePassword = createAsyncThunk(
  'users/updateProfilePassword',
  async (payload: any, { rejectWithValue }) => {
    try {
      const { response, data } = await updateProfilePasswordApi(payload);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        return rejectWithValue(data.message);
      }
      showSuccessDialog('Berhasil', 'Kata sandi berhasil diperbarui');
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      return rejectWithValue(error.message);
    }
  }
);
