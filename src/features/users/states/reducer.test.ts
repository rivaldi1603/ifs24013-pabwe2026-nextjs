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
    expect(usersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setUsers', () => {
    const users = [{ id: 1 }] as User[];
    expect(usersReducer(initialState, setUsers(users))).toEqual({
      ...initialState,
      users,
    });
  });

  it('should handle setProfile', () => {
    const profile = { id: 1 } as User;
    expect(usersReducer(initialState, setProfile(profile))).toEqual({
      ...initialState,
      profile,
    });
  });

  it('should handle setIsProfile', () => {
    expect(usersReducer(initialState, setIsProfile(true))).toEqual({
      ...initialState,
      isProfile: true,
    });
  });

  it('should handle setIsChangeProfile', () => {
    expect(usersReducer(initialState, setIsChangeProfile(true))).toEqual({
      ...initialState,
      isChangeProfile: true,
    });
  });

  it('should handle setIsChangeProfilePhoto', () => {
    expect(usersReducer(initialState, setIsChangeProfilePhoto(true))).toEqual({
      ...initialState,
      isChangeProfilePhoto: true,
    });
  });

  it('should handle setIsChangeProfilePassword', () => {
    expect(usersReducer(initialState, setIsChangeProfilePassword(true))).toEqual({
      ...initialState,
      isChangeProfilePassword: true,
    });
  });
});
