import { describe, it, expect } from 'vitest';
import { store } from './store';

describe('Redux Store', () => {
  it('should configure the store with auth, users, and posts reducers', () => {
    const state = store.getState();
    
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('users');
    expect(state).toHaveProperty('posts');
    
    expect(state.auth.isAuthLogin).toBeDefined();
    expect(state.users.users).toBeDefined();
    expect(state.posts.posts).toBeDefined();
  });
});
