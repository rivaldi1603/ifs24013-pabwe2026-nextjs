import { createSlice } from '@reduxjs/toolkit';
import { asyncAuthLogin, asyncAuthRegister, asyncAuthLogout } from './action';

interface AuthState {
  isAuthLogin: boolean;
  isAuthRegister: boolean;
  isAuthLogout: boolean;
}

const initialState: AuthState = {
  isAuthLogin: false,
  isAuthRegister: false,
  isAuthLogout: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthStatus(state) {
      state.isAuthLogin = false;
      state.isAuthRegister = false;
      state.isAuthLogout = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncAuthLogin.pending, (state) => {
        state.isAuthLogin = true;
      })
      .addCase(asyncAuthLogin.fulfilled, (state) => {
        state.isAuthLogin = false;
      })
      .addCase(asyncAuthLogin.rejected, (state) => {
        state.isAuthLogin = false;
      })
      
      .addCase(asyncAuthRegister.pending, (state) => {
        state.isAuthRegister = true;
      })
      .addCase(asyncAuthRegister.fulfilled, (state) => {
        state.isAuthRegister = false;
      })
      .addCase(asyncAuthRegister.rejected, (state) => {
        state.isAuthRegister = false;
      })
      
      .addCase(asyncAuthLogout.pending, (state) => {
        state.isAuthLogout = true;
      })
      .addCase(asyncAuthLogout.fulfilled, (state) => {
        state.isAuthLogout = false;
      })
      .addCase(asyncAuthLogout.rejected, (state) => {
        state.isAuthLogout = false;
      });
  },
});

export const { resetAuthStatus } = authSlice.actions;
export default authSlice.reducer;
