import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    setIsAuthLogin(state, action: PayloadAction<boolean>) {
      state.isAuthLogin = action.payload;
    },
    setIsAuthRegister(state, action: PayloadAction<boolean>) {
      state.isAuthRegister = action.payload;
    },
    setIsAuthLogout(state, action: PayloadAction<boolean>) {
      state.isAuthLogout = action.payload;
    },
    resetAuthStatus(state) {
      state.isAuthLogin = false;
      state.isAuthRegister = false;
      state.isAuthLogout = false;
    }
  },
});

export const { resetAuthStatus, setIsAuthLogin, setIsAuthRegister, setIsAuthLogout } = authSlice.actions;
export default authSlice.reducer;
