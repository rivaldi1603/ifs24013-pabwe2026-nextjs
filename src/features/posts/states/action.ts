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
import {
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
} from './reducer';
import type { AppDispatch } from '../../../store';

export function asyncGetPosts({ isMe, search }: { isMe?: boolean; search?: string } = {}) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPost(true));
    try {
      const { response, data } = await getPostsApi(isMe, search);
      if (!response.ok) {
        throw new Error(data.message);
      }
      dispatch(setPosts(data.data.posts || []));
      return data.data.posts;
    } catch (error: any) {
      throw error;
    } finally {
      dispatch(setIsPost(false));
    }
  };
}

export function asyncGetPostDetail(id: number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPost(true));
    try {
      const { response, data } = await getPostDetailApi(id);
      if (!response.ok) {
        throw new Error(data.message);
      }
      dispatch(setPost(data.data.post));
      return data.data.post;
    } catch (error: any) {
      throw error;
    } finally {
      dispatch(setIsPost(false));
    }
  };
}

export function asyncAddPost(payload: { description: string }) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostAdd(true));
    try {
      const { response, data } = await addPostApi(payload);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        throw new Error(data.message);
      }
      showSuccessDialog('Berhasil', 'Postingan berhasil ditambahkan');
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      throw error;
    } finally {
      dispatch(setIsPostAdd(false));
    }
  };
}

export function asyncUpdatePost({ id, description }: { id: number; description: string }) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostChange(true));
    try {
      const { response, data } = await updatePostApi(id, { description });
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        throw new Error(data.message);
      }
      showSuccessDialog('Berhasil', 'Postingan berhasil diperbarui');
      dispatch(asyncGetPostDetail(id) as any).catch(() => {});
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      throw error;
    } finally {
      dispatch(setIsPostChange(false));
    }
  };
}

export function asyncUpdatePostCover({ id, file }: { id: number; file: File }) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostChangeCover(true));
    try {
      const { response, data } = await updatePostCoverApi(id, file);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        throw new Error(data.message);
      }
      showSuccessDialog('Berhasil', 'Cover postingan berhasil diperbarui');
      dispatch(asyncGetPostDetail(id) as any).catch(() => {});
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      throw error;
    } finally {
      dispatch(setIsPostChangeCover(false));
    }
  };
}

export function asyncDeletePost(id: number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostDelete(true));
    try {
      const { response, data } = await deletePostApi(id);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        throw new Error(data.message);
      }
      showSuccessDialog('Berhasil', 'Postingan berhasil dihapus');
      return id;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      throw error;
    } finally {
      dispatch(setIsPostDelete(false));
    }
  };
}

export function asyncToggleLike(id: number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostLike(true));
    try {
      const { response, data } = await toggleLikeApi(id);
      if (!response.ok) throw new Error(data.message);
      return id;
    } catch (error: any) {
      throw error;
    } finally {
      dispatch(setIsPostLike(false));
    }
  };
}

export function asyncAddComment({ id, comment }: { id: number; comment: string }) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostAddComment(true));
    try {
      const { response, data } = await addCommentApi(id, { comment });
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        throw new Error(data.message);
      }
      dispatch(asyncGetPostDetail(id) as any).catch(() => {});
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      throw error;
    } finally {
      dispatch(setIsPostAddComment(false));
    }
  };
}

export function asyncDeleteComment({ postId, commentId }: { postId: number; commentId: number }) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostDeleteComment(true));
    try {
      const { response, data } = await deleteCommentApi(postId, commentId);
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        throw new Error(data.message);
      }
      dispatch(asyncGetPostDetail(postId) as any).catch(() => {});
      return data;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      throw error;
    } finally {
      dispatch(setIsPostDeleteComment(false));
    }
  };
}

export function asyncDeleteAllPosts() {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostDeleteAll(true));
    try {
      const { response, data } = await deleteAllPostsApi();
      if (!response.ok) {
        showErrorDialog('Gagal', data.message);
        throw new Error(data.message);
      }
      showSuccessDialog('Berhasil', 'Seluruh postingan Anda berhasil dihapus');
      return true;
    } catch (error: any) {
      showErrorDialog('Error', error.message);
      throw error;
    } finally {
      dispatch(setIsPostDeleteAll(false));
    }
  };
}

export { resetPostStatus } from './reducer';
