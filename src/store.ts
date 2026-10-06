import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/auth/states/reducer';
import usersReducer from './features/users/states/reducer';
import postsReducer from './features/posts/states/reducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  posts: postsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
