import { describe, it, expect } from 'vitest';
import postsReducer, { resetPostStatus } from '../states/reducer';
import * as actions from '../states/action';
import { Post } from '../../../types';

describe('Posts Reducer', () => {
  const initialState = {
    posts: [],
    post: null,
    isPost: false,
    isPostAdd: false,
    isPostAdded: false,
    isPostChange: false,
    isPostChanged: false,
    isPostChangeCover: false,
    isPostChangedCover: false,
    isPostDelete: false,
    isPostDeleted: false,
    isPostLike: false,
    isPostLiked: false,
    isPostAddComment: false,
    isPostAddedComment: false,
    isPostDeleteComment: false,
    isPostDeletedComment: false,
    isPostDeleteAll: false,
    isPostDeletedAll: false,
  };

  it('resetPostStatus', () => {
    expect(postsReducer({ ...initialState, isPostAdded: true }, resetPostStatus())).toEqual(initialState);
  });

  it('asyncGetPosts', () => {
    const nextState = postsReducer(initialState, actions.asyncGetPosts.fulfilled([] as any, '', {}));
    expect(nextState.posts).toEqual([]);
  });

  it('asyncGetPostDetail', () => {
    const nextState = postsReducer(initialState, actions.asyncGetPostDetail.fulfilled({ id: 1 } as any, '', 1));
    expect(nextState.post).toEqual({ id: 1 });
  });

  it('asyncAddPost', () => {
    const nextState = postsReducer(initialState, actions.asyncAddPost.fulfilled({} as any, '', { description: '' }));
    expect(nextState.isPostAdded).toBe(true);
  });

  it('asyncDeletePost', () => {
    const state = { ...initialState, posts: [{ id: 1 } as any] };
    const nextState = postsReducer(state, actions.asyncDeletePost.fulfilled(1, '', 1));
    expect(nextState.posts).toHaveLength(0);
  });

  it('asyncToggleLike', () => {
    const state = { 
      ...initialState, 
      posts: [{ id: 1, is_liked: false, likes_count: 0 } as any],
      post: { id: 1, is_liked: false, likes_count: 0 } as any
    };
    const nextState = postsReducer(state, actions.asyncToggleLike.fulfilled(1, '', 1));
    expect(nextState.posts[0].is_liked).toBe(true);
    expect(nextState.posts[0].likes_count).toBe(1);
    expect(nextState.post?.is_liked).toBe(true);
  });

  it('asyncDeleteAllPosts', () => {
    const state = { ...initialState, posts: [{ id: 1, is_me: true } as any, { id: 2, is_me: false } as any] };
    const nextState = postsReducer(state, actions.asyncDeleteAllPosts.fulfilled(true, '', undefined));
    expect(nextState.posts).toHaveLength(1);
    expect(nextState.posts[0].id).toBe(2);
  });
});
