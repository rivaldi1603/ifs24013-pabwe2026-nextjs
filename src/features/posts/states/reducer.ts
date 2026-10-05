import { createSlice } from '@reduxjs/toolkit';
import { Post } from '../../../types';
import { 
  asyncGetPosts, asyncGetPostDetail, asyncAddPost, asyncUpdatePost, 
  asyncUpdatePostCover, asyncDeletePost, asyncToggleLike, asyncAddComment, 
  asyncDeleteComment, asyncDeleteAllPosts 
} from './action';

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
      state.isPostDeletedAll = false;
    }
  },
  extraReducers: (builder) => {
    // Get Posts
    builder.addCase(asyncGetPosts.pending, (state) => { state.isPost = true; });
    builder.addCase(asyncGetPosts.fulfilled, (state, action) => {
      state.isPost = false;
      state.posts = action.payload || [];
    });
    builder.addCase(asyncGetPosts.rejected, (state) => { state.isPost = false; });

    // Get Post Detail
    builder.addCase(asyncGetPostDetail.pending, (state) => { state.isPost = true; });
    builder.addCase(asyncGetPostDetail.fulfilled, (state, action) => {
      state.isPost = false;
      state.post = action.payload;
    });
    builder.addCase(asyncGetPostDetail.rejected, (state) => { state.isPost = false; });

    // Add Post
    builder.addCase(asyncAddPost.pending, (state) => { state.isPostAdd = true; state.isPostAdded = false; });
    builder.addCase(asyncAddPost.fulfilled, (state) => { state.isPostAdd = false; state.isPostAdded = true; });
    builder.addCase(asyncAddPost.rejected, (state) => { state.isPostAdd = false; });

    // Update Post
    builder.addCase(asyncUpdatePost.pending, (state) => { state.isPostChange = true; state.isPostChanged = false; });
    builder.addCase(asyncUpdatePost.fulfilled, (state) => { state.isPostChange = false; state.isPostChanged = true; });
    builder.addCase(asyncUpdatePost.rejected, (state) => { state.isPostChange = false; });

    // Update Cover
    builder.addCase(asyncUpdatePostCover.pending, (state) => { state.isPostChangeCover = true; state.isPostChangedCover = false; });
    builder.addCase(asyncUpdatePostCover.fulfilled, (state) => { state.isPostChangeCover = false; state.isPostChangedCover = true; });
    builder.addCase(asyncUpdatePostCover.rejected, (state) => { state.isPostChangeCover = false; });

    // Delete Post
    builder.addCase(asyncDeletePost.pending, (state) => { state.isPostDelete = true; state.isPostDeleted = false; });
    builder.addCase(asyncDeletePost.fulfilled, (state, action) => {
      state.isPostDelete = false;
      state.isPostDeleted = true;
      state.posts = state.posts.filter(p => p.id !== action.payload);
    });
    builder.addCase(asyncDeletePost.rejected, (state) => { state.isPostDelete = false; });

    // Toggle Like (Optimistic or standard update)
    builder.addCase(asyncToggleLike.pending, (state) => { state.isPostLike = true; });
    builder.addCase(asyncToggleLike.fulfilled, (state, action) => {
      state.isPostLike = false;
      state.isPostLiked = true;
      // Also update the specific post in state.posts and state.post
      const updateLike = (p: Post) => {
        if (p.id === action.payload) {
          p.is_liked = !p.is_liked;
          p.likes_count += p.is_liked ? 1 : -1;
        }
      };
      if (state.post) updateLike(state.post);
      state.posts.forEach(updateLike);
    });
    builder.addCase(asyncToggleLike.rejected, (state) => { state.isPostLike = false; });

    // Add Comment
    builder.addCase(asyncAddComment.pending, (state) => { state.isPostAddComment = true; });
    builder.addCase(asyncAddComment.fulfilled, (state) => { state.isPostAddComment = false; state.isPostAddedComment = true; });
    builder.addCase(asyncAddComment.rejected, (state) => { state.isPostAddComment = false; });

    // Delete Comment
    builder.addCase(asyncDeleteComment.pending, (state) => { state.isPostDeleteComment = true; });
    builder.addCase(asyncDeleteComment.fulfilled, (state) => { state.isPostDeleteComment = false; state.isPostDeletedComment = true; });
    builder.addCase(asyncDeleteComment.rejected, (state) => { state.isPostDeleteComment = false; });

    // Delete All Posts
    builder.addCase(asyncDeleteAllPosts.pending, (state) => { state.isPostDeleteAll = true; });
    builder.addCase(asyncDeleteAllPosts.fulfilled, (state) => {
      state.isPostDeleteAll = false;
      state.isPostDeletedAll = true;
      // Optionally filter out all is_me=true posts from state
      state.posts = state.posts.filter(p => !p.is_me);
    });
    builder.addCase(asyncDeleteAllPosts.rejected, (state) => { state.isPostDeleteAll = false; });
  },
});

export const { resetPostStatus } = postsSlice.actions;
export default postsSlice.reducer;
