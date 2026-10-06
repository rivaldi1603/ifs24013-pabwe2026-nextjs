import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../types';

interface UsersState {
  users: User[];
  user: User | null;
  profile: User | null;
  isProfile: boolean;
  isChangeProfile: boolean;
  isChangeProfilePhoto: boolean;
  isChangeProfilePassword: boolean;
}

const initialState: UsersState = {
  users: [],
  user: null,
  profile: null,
  isProfile: false,
  isChangeProfile: false,
  isChangeProfilePhoto: false,
  isChangeProfilePassword: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    setProfile(state, action: PayloadAction<User | null>) {
      state.profile = action.payload;
    },
    setIsProfile(state, action: PayloadAction<boolean>) {
      state.isProfile = action.payload;
    },
    setIsChangeProfile(state, action: PayloadAction<boolean>) {
      state.isChangeProfile = action.payload;
    },
    setIsChangeProfilePhoto(state, action: PayloadAction<boolean>) {
      state.isChangeProfilePhoto = action.payload;
    },
    setIsChangeProfilePassword(state, action: PayloadAction<boolean>) {
      state.isChangeProfilePassword = action.payload;
    },
  },
});

export const {
  setUsers,
  setProfile,
  setIsProfile,
  setIsChangeProfile,
  setIsChangeProfilePhoto,
  setIsChangeProfilePassword
} = usersSlice.actions;

export default usersSlice.reducer;
