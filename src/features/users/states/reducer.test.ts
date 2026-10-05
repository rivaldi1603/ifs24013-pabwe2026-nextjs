import { describe, it, expect } from 'vitest';
import usersReducer from '../states/reducer';
import { 
  asyncGetUsers, asyncGetProfile, asyncUpdateProfile, 
  asyncUpdateProfilePhoto, asyncUpdateProfilePassword 
} from '../states/action';

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

  // asyncGetUsers
  it('should handle asyncGetUsers.fulfilled', () => {
    const users = [{ id: 1, name: 'Test' }] as any;
    expect(usersReducer(initialState, asyncGetUsers.fulfilled(users, '', undefined))).toEqual({
      ...initialState,
      users,
    });
  });

  // asyncGetProfile
  it('should handle asyncGetProfile.pending', () => {
    expect(usersReducer(initialState, asyncGetProfile.pending(''))).toEqual({
      ...initialState,
      isProfile: true,
    });
  });

  it('should handle asyncGetProfile.fulfilled', () => {
    const profile = { id: 1, name: 'Test' } as any;
    expect(usersReducer({ ...initialState, isProfile: true }, asyncGetProfile.fulfilled(profile, '', undefined))).toEqual({
      ...initialState,
      isProfile: false,
      profile,
    });
  });

  it('should handle asyncGetProfile.rejected', () => {
    expect(usersReducer({ ...initialState, isProfile: true }, asyncGetProfile.rejected(new Error(), '', undefined))).toEqual({
      ...initialState,
      isProfile: false,
      profile: null,
    });
  });

  // asyncUpdateProfile
  it('should handle asyncUpdateProfile.pending', () => {
    expect(usersReducer(initialState, asyncUpdateProfile.pending('', {}))).toEqual({
      ...initialState,
      isChangeProfile: true,
    });
  });

  it('should handle asyncUpdateProfile.fulfilled', () => {
    expect(usersReducer({ ...initialState, isChangeProfile: true }, asyncUpdateProfile.fulfilled({}, '', {}))).toEqual({
      ...initialState,
      isChangeProfile: false,
    });
  });

  it('should handle asyncUpdateProfile.rejected', () => {
    expect(usersReducer({ ...initialState, isChangeProfile: true }, asyncUpdateProfile.rejected(new Error(), '', {}))).toEqual({
      ...initialState,
      isChangeProfile: false,
    });
  });

  // asyncUpdateProfilePhoto
  it('should handle asyncUpdateProfilePhoto.pending', () => {
    expect(usersReducer(initialState, asyncUpdateProfilePhoto.pending('', {} as any))).toEqual({
      ...initialState,
      isChangeProfilePhoto: true,
    });
  });

  it('should handle asyncUpdateProfilePhoto.fulfilled', () => {
    expect(usersReducer({ ...initialState, isChangeProfilePhoto: true }, asyncUpdateProfilePhoto.fulfilled({}, '', {} as any))).toEqual({
      ...initialState,
      isChangeProfilePhoto: false,
    });
  });

  it('should handle asyncUpdateProfilePhoto.rejected', () => {
    expect(usersReducer({ ...initialState, isChangeProfilePhoto: true }, asyncUpdateProfilePhoto.rejected(new Error(), '', {} as any))).toEqual({
      ...initialState,
      isChangeProfilePhoto: false,
    });
  });

  // asyncUpdateProfilePassword
  it('should handle asyncUpdateProfilePassword.pending', () => {
    expect(usersReducer(initialState, asyncUpdateProfilePassword.pending('', {}))).toEqual({
      ...initialState,
      isChangeProfilePassword: true,
    });
  });

  it('should handle asyncUpdateProfilePassword.fulfilled', () => {
    expect(usersReducer({ ...initialState, isChangeProfilePassword: true }, asyncUpdateProfilePassword.fulfilled({}, '', {}))).toEqual({
      ...initialState,
      isChangeProfilePassword: false,
    });
  });

  it('should handle asyncUpdateProfilePassword.rejected', () => {
    expect(usersReducer({ ...initialState, isChangeProfilePassword: true }, asyncUpdateProfilePassword.rejected(new Error(), '', {}))).toEqual({
      ...initialState,
      isChangeProfilePassword: false,
    });
  });
});
