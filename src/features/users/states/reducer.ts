import { createSlice } from '@reduxjs/toolkit';
import { 
  asyncGetUsers, 
  asyncGetProfile, 
  asyncUpdateProfile, 
  asyncUpdateProfilePhoto, 
  asyncUpdateProfilePassword 
} from './action';
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
  reducers: {},
  extraReducers: (builder) => {
    // Get Users
    builder
      .addCase(asyncGetUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
      
    // Get Profile
    builder
      .addCase(asyncGetProfile.pending, (state) => {
        state.isProfile = true;
      })
      .addCase(asyncGetProfile.fulfilled, (state, action) => {
        state.isProfile = false;
        state.profile = action.payload;
      })
      .addCase(asyncGetProfile.rejected, (state) => {
        state.isProfile = false;
        state.profile = null;
      });

    // Update Profile
    builder
      .addCase(asyncUpdateProfile.pending, (state) => {
        state.isChangeProfile = true;
      })
      .addCase(asyncUpdateProfile.fulfilled, (state) => {
        state.isChangeProfile = false;
      })
      .addCase(asyncUpdateProfile.rejected, (state) => {
        state.isChangeProfile = false;
      });

    // Update Photo
    builder
      .addCase(asyncUpdateProfilePhoto.pending, (state) => {
        state.isChangeProfilePhoto = true;
      })
      .addCase(asyncUpdateProfilePhoto.fulfilled, (state) => {
        state.isChangeProfilePhoto = false;
      })
      .addCase(asyncUpdateProfilePhoto.rejected, (state) => {
        state.isChangeProfilePhoto = false;
      });

    // Update Password
    builder
      .addCase(asyncUpdateProfilePassword.pending, (state) => {
        state.isChangeProfilePassword = true;
      })
      .addCase(asyncUpdateProfilePassword.fulfilled, (state) => {
        state.isChangeProfilePassword = false;
      })
      .addCase(asyncUpdateProfilePassword.rejected, (state) => {
        state.isChangeProfilePassword = false;
      });
  },
});

export default usersSlice.reducer;
