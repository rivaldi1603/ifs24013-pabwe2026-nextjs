import { describe, it, expect } from 'vitest';
import authReducer, { resetAuthStatus } from '../states/reducer';
import { asyncAuthLogin, asyncAuthRegister, asyncAuthLogout } from '../states/action';

describe('Auth Reducer', () => {
  const initialState = {
    isAuthLogin: false,
    isAuthRegister: false,
    isAuthLogout: false,
  };

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle resetAuthStatus', () => {
    const state = {
      isAuthLogin: true,
      isAuthRegister: true,
      isAuthLogout: true,
    };
    expect(authReducer(state, resetAuthStatus())).toEqual(initialState);
  });

  // Login
  it('should handle asyncAuthLogin.pending', () => {
    expect(authReducer(initialState, asyncAuthLogin.pending(''))).toEqual({
      ...initialState,
      isAuthLogin: true,
    });
  });

  it('should handle asyncAuthLogin.fulfilled', () => {
    expect(authReducer({ ...initialState, isAuthLogin: true }, asyncAuthLogin.fulfilled(null, '', ''))).toEqual({
      ...initialState,
      isAuthLogin: false,
    });
  });

  it('should handle asyncAuthLogin.rejected', () => {
    expect(authReducer({ ...initialState, isAuthLogin: true }, asyncAuthLogin.rejected(new Error(), '', ''))).toEqual({
      ...initialState,
      isAuthLogin: false,
    });
  });

  // Register
  it('should handle asyncAuthRegister.pending', () => {
    expect(authReducer(initialState, asyncAuthRegister.pending(''))).toEqual({
      ...initialState,
      isAuthRegister: true,
    });
  });

  it('should handle asyncAuthRegister.fulfilled', () => {
    expect(authReducer({ ...initialState, isAuthRegister: true }, asyncAuthRegister.fulfilled(null, '', ''))).toEqual({
      ...initialState,
      isAuthRegister: false,
    });
  });

  it('should handle asyncAuthRegister.rejected', () => {
    expect(authReducer({ ...initialState, isAuthRegister: true }, asyncAuthRegister.rejected(new Error(), '', ''))).toEqual({
      ...initialState,
      isAuthRegister: false,
    });
  });

  // Logout
  it('should handle asyncAuthLogout.pending', () => {
    expect(authReducer(initialState, asyncAuthLogout.pending(''))).toEqual({
      ...initialState,
      isAuthLogout: true,
    });
  });

  it('should handle asyncAuthLogout.fulfilled', () => {
    expect(authReducer({ ...initialState, isAuthLogout: true }, asyncAuthLogout.fulfilled(true, '', undefined))).toEqual({
      ...initialState,
      isAuthLogout: false,
    });
  });

  it('should handle asyncAuthLogout.rejected', () => {
    expect(authReducer({ ...initialState, isAuthLogout: true }, asyncAuthLogout.rejected(new Error(), '', undefined))).toEqual({
      ...initialState,
      isAuthLogout: false,
    });
  });
});
