import { describe, it, expect } from 'vitest';
import authReducer, { resetAuthStatus, setIsAuthLogin, setIsAuthRegister, setIsAuthLogout } from '../states/reducer';

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

  it('should handle setIsAuthLogin', () => {
    expect(authReducer(initialState, setIsAuthLogin(true))).toEqual({
      ...initialState,
      isAuthLogin: true,
    });
  });

  it('should handle setIsAuthRegister', () => {
    expect(authReducer(initialState, setIsAuthRegister(true))).toEqual({
      ...initialState,
      isAuthRegister: true,
    });
  });

  it('should handle setIsAuthLogout', () => {
    expect(authReducer(initialState, setIsAuthLogout(true))).toEqual({
      ...initialState,
      isAuthLogout: true,
    });
  });
});
