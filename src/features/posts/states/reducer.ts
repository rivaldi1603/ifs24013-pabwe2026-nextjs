import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../../types';

interface PostsState {
  posts: Post[];
  post: Post | null;
  isPost: boolean;
  isPostAdd: boolean;
  isPostAdded: boolean;
  isPostChange: boolean;
  isPostChanged: boolean;
  isPostChangeCover: boolean;
  isPostChangedCover: boolean;
  isPostDelete: boolean;
  isPostDeleted: boolean;
  isPostLike: boolean;
  isPostLiked: boolean;
  isPostAddComment: boolean;
  isPostAddedComment: boolean;
  isPostDeleteComment: boolean;
  isPostDeletedComment: boolean;
  isPostDeleteAll: boolean;
  isPostDeletedAll: boolean;
}

const initialState: PostsState = {
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

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetPostStatus(state) {
      state.isPostAdded = false;
      state.isPostChanged = false;
      state.isPostChangedCover = false;
      state.isPostDeleted = false;
      state.isPostLiked = false;
      state.isPostAddedComment = false;
      state.isPostDeletedComment = false;
      state.isPostDeletedAll = false;
    },
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    setPost(state, action: PayloadAction<Post | null>) {
      state.post = action.payload;
    },
    setIsPost(state, action: PayloadAction<boolean>) {
      state.isPost = action.payload;
    },
    setIsPostAdd(state, action: PayloadAction<boolean>) {
      state.isPostAdd = action.payload;
    },
    setIsPostChange(state, action: PayloadAction<boolean>) {
      state.isPostChange = action.payload;
    },
    setIsPostChangeCover(state, action: PayloadAction<boolean>) {
      state.isPostChangeCover = action.payload;
    },
    setIsPostDelete(state, action: PayloadAction<boolean>) {
      state.isPostDelete = action.payload;
    },
    setIsPostLike(state, action: PayloadAction<boolean>) {
      state.isPostLike = action.payload;
    },
    setIsPostAddComment(state, action: PayloadAction<boolean>) {
      state.isPostAddComment = action.payload;
    },
    setIsPostDeleteComment(state, action: PayloadAction<boolean>) {
      state.isPostDeleteComment = action.payload;
    },
    setIsPostDeleteAll(state, action: PayloadAction<boolean>) {
      state.isPostDeleteAll = action.payload;
    },
  },
});

export const {
  resetPostStatus,
  setPosts,
  setPost,
  setIsPost,
  setIsPostAdd,
  setIsPostChange,
  setIsPostChangeCover,
  setIsPostDelete,
  setIsPostLike,
  setIsPostAddComment,
  setIsPostDeleteComment,
  setIsPostDeleteAll
} = postsSlice.actions;

export default postsSlice.reducer;
