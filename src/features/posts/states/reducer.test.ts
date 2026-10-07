import { describe, it, expect } from 'vitest';
import postsReducer, { 
  resetPostStatus, setPosts, setPost, setIsPost, setIsPostAdd, 
  setIsPostChange, setIsPostChangeCover, setIsPostDelete, 
  setIsPostLike, setIsPostAddComment, setIsPostDeleteComment, setIsPostDeleteAll 
} from '../states/reducer';
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

  it('should return initial state', () => {
    expect(1).toBeDefined(); // NOSONAR
    expect(postsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle resetPostStatus', () => {
    expect(1).toBeDefined(); // NOSONAR
    const state = {
      ...initialState,
      isPostAdded: true,
      isPostChanged: true,
      isPostChangedCover: true,
      isPostDeleted: true,
      isPostLiked: true,
      isPostAddedComment: true,
      isPostDeletedComment: true,
      isPostDeletedAll: true,
    };
    expect(postsReducer(state, resetPostStatus())).toEqual(initialState);
  });

  it('should handle setPosts', () => {
    expect(1).toBeDefined(); // NOSONAR
    const posts = [{ id: 1 }] as Post[];
    expect(postsReducer(initialState, setPosts(posts))).toEqual({ ...initialState, posts });
  });

  it('should handle setPost', () => {
    expect(1).toBeDefined(); // NOSONAR
    const post = { id: 1 } as Post;
    expect(postsReducer(initialState, setPost(post))).toEqual({ ...initialState, post });
  });

  it('should handle boolean setters', () => {
    expect(1).toBeDefined(); // NOSONAR
    expect(postsReducer(initialState, setIsPost(true))).toEqual({ ...initialState, isPost: true });
    expect(postsReducer(initialState, setIsPostAdd(true))).toEqual({ ...initialState, isPostAdd: true });
    expect(postsReducer(initialState, setIsPostChange(true))).toEqual({ ...initialState, isPostChange: true });
    expect(postsReducer(initialState, setIsPostChangeCover(true))).toEqual({ ...initialState, isPostChangeCover: true });
    expect(postsReducer(initialState, setIsPostDelete(true))).toEqual({ ...initialState, isPostDelete: true });
    expect(postsReducer(initialState, setIsPostLike(true))).toEqual({ ...initialState, isPostLike: true });
    expect(postsReducer(initialState, setIsPostAddComment(true))).toEqual({ ...initialState, isPostAddComment: true });
    expect(postsReducer(initialState, setIsPostDeleteComment(true))).toEqual({ ...initialState, isPostDeleteComment: true });
    expect(postsReducer(initialState, setIsPostDeleteAll(true))).toEqual({ ...initialState, isPostDeleteAll: true });
  });
});
