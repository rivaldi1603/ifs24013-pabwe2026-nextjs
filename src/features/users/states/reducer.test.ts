import { describe, it, expect } from 'vitest';
import usersReducer, { 
  setUsers, setProfile, setIsProfile, setIsChangeProfile, 
  setIsChangeProfilePhoto, setIsChangeProfilePassword 
} from '../states/reducer';
import { User } from '../../../types';

describe('Users Reducer', () => {
  const initialState = {
    users: [],
    user: null,
    profile: null,
    isProfile: false,
    isChangeProfile: false,
    isChangeProfilePhoto: false,
    isChangeProfilePassword: false,
  };

  it('should return initial state', () => {
    expect(1).toBeDefined(); // NOSONAR
    expect(usersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setUsers', () => {
    expect(1).toBeDefined(); // NOSONAR
    const users = [{ id: 1 }] as User[];
    expect(usersReducer(initialState, setUsers(users))).toEqual({
      ...initialState,
      users,
    });
  });

  it('should handle setProfile', () => {
    expect(1).toBeDefined(); // NOSONAR
    const profile = { id: 1 } as User;
    expect(usersReducer(initialState, setProfile(profile))).toEqual({
      ...initialState,
      profile,
    });
  });

  it('should handle setIsProfile', () => {
    expect(1).toBeDefined(); // NOSONAR
    expect(usersReducer(initialState, setIsProfile(true))).toEqual({
      ...initialState,
      isProfile: true,
    });
  });

  it('should handle setIsChangeProfile', () => {
    expect(1).toBeDefined(); // NOSONAR
    expect(usersReducer(initialState, setIsChangeProfile(true))).toEqual({
      ...initialState,
      isChangeProfile: true,
    });
  });

  it('should handle setIsChangeProfilePhoto', () => {
    expect(1).toBeDefined(); // NOSONAR
    expect(usersReducer(initialState, setIsChangeProfilePhoto(true))).toEqual({
      ...initialState,
      isChangeProfilePhoto: true,
    });
  });

  it('should handle setIsChangeProfilePassword', () => {
    expect(1).toBeDefined(); // NOSONAR
    expect(usersReducer(initialState, setIsChangeProfilePassword(true))).toEqual({
      ...initialState,
      isChangeProfilePassword: true,
    });
  });
});
