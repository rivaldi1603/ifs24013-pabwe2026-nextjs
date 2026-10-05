import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getPostsApi, 
  getPostDetailApi, 
  addPostApi, 
  updatePostApi, 
  updatePostCoverApi, 
  deletePostApi, 
  toggleLikeApi, 
  addCommentApi, 
  deleteCommentApi, 
  deleteAllPostsApi 
} from '../api/postApi';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';

export const asyncGetPosts = createAsyncThunk(
  'posts/getPosts',
  async ({ isMe, search }: { isMe?: boolean; search?: string } = {}, { rejectWithValue }) => {
    try {
      const { response, data } = await getPostsApi(isMe, search);
      if (!response.ok) return rejectWithValue(data.message);
      return data.data; // Array of posts
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncGetPostDetail = createAsyncThunk(
  'posts/getPostDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      const { response, data } = await getPostDetailApi(id);
      if (!response.ok) return rejectWithValue(data.message);
      return data.data; // Post object
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncAddPost = createAsyncThunk(
  'posts/addPost',
  async (payload: { description: string }, { rejectWithValue }) => {
    try {
      const { response, data } = await addPostApi(payload);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        return rejectWithValue(data.message);
      }
      showSuccessDialog('Berhasil', 'Postingan berhasil ditambahkan');
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncUpdatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, description }: { id: number; description: string }, { rejectWithValue, dispatch }) => {
    try {
      const { response, data } = await updatePostApi(id, { description });
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        return rejectWithValue(data.message);
      }
      showSuccessDialog('Berhasil', 'Postingan berhasil diperbarui');
      dispatch(asyncGetPostDetail(id));
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncUpdatePostCover = createAsyncThunk(
  'posts/updatePostCover',
  async ({ id, file }: { id: number; file: File }, { rejectWithValue, dispatch }) => {
    try {
      const { response, data } = await updatePostCoverApi(id, file);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        return rejectWithValue(data.message);
      }
      showSuccessDialog('Berhasil', 'Cover postingan berhasil diperbarui');
      dispatch(asyncGetPostDetail(id));
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncDeletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: number, { rejectWithValue }) => {
    try {
      const { response, data } = await deletePostApi(id);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        return rejectWithValue(data.message);
      }
      showSuccessDialog('Berhasil', 'Postingan berhasil dihapus');
      return id;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncToggleLike = createAsyncThunk(
  'posts/toggleLike',
  async (id: number, { rejectWithValue }) => {
    try {
      const { response, data } = await toggleLikeApi(id);
      if (!response.ok) return rejectWithValue(data.message);
      // Not showing dialog for like toggle as it should be seamless
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncAddComment = createAsyncThunk(
  'posts/addComment',
  async ({ id, comment }: { id: number; comment: string }, { rejectWithValue, dispatch }) => {
    try {
      const { response, data } = await addCommentApi(id, { comment });
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        return rejectWithValue(data.message);
      }
      dispatch(asyncGetPostDetail(id));
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncDeleteComment = createAsyncThunk(
  'posts/deleteComment',
  async ({ postId, commentId }: { postId: number; commentId: number }, { rejectWithValue, dispatch }) => {
    try {
      const { response, data } = await deleteCommentApi(postId, commentId);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        return rejectWithValue(data.message);
      }
      dispatch(asyncGetPostDetail(postId));
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const asyncDeleteAllPosts = createAsyncThunk(
  'posts/deleteAllPosts',
  async (_, { rejectWithValue }) => {
    try {
      const { response, data } = await deleteAllPostsApi();
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        return rejectWithValue(data.message);
      }
      showSuccessDialog('Berhasil', 'Seluruh postingan Anda berhasil dihapus');
      return true;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export { resetPostStatus } from './reducer';
