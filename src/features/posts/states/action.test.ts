import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  asyncGetPosts, asyncGetPostDetail, asyncAddPost, asyncUpdatePost, 
  asyncUpdatePostCover, asyncDeletePost, asyncToggleLike, asyncAddComment, 
  asyncDeleteComment, asyncDeleteAllPosts 
} from '../states/action';
import * as postApi from '../api/postApi';
import * as toolsHelper from '../../../helpers/toolsHelper';
import * as reducer from '../states/reducer';

vi.mock('../api/postApi', () => ({
  getPostsApi: vi.fn(),
  getPostDetailApi: vi.fn(),
  addPostApi: vi.fn(),
  updatePostApi: vi.fn(),
  updatePostCoverApi: vi.fn(),
  deletePostApi: vi.fn(),
  toggleLikeApi: vi.fn(),
  addCommentApi: vi.fn(),
  deleteCommentApi: vi.fn(),
  deleteAllPostsApi: vi.fn(),
}));

vi.mock('../../../helpers/toolsHelper', () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

describe('Posts Actions', () => {
  let dispatch: any;

  beforeEach(() => {
    dispatch = vi.fn().mockResolvedValue(true);
    vi.clearAllMocks();
  });

  describe('asyncGetPosts', () => {
    it('should fetch posts successfully', async () => {
      (postApi.getPostsApi as any).mockResolvedValue({ response: { ok: true }, data: { data: { posts: [{ id: 1 }] } } });
      const action = asyncGetPosts();
      const result = await action(dispatch);
      expect(result).toEqual([{ id: 1 }]);
      expect(dispatch).toHaveBeenCalledWith(reducer.setPosts([{ id: 1 }] as any));
    });

    it('should handle fetch failure', async () => {
      (postApi.getPostsApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncGetPosts();
      await expect(action(dispatch)).rejects.toThrow('Error');
    });
  });

  describe('asyncGetPostDetail', () => {
    it('should fetch post detail successfully', async () => {
      (postApi.getPostDetailApi as any).mockResolvedValue({ response: { ok: true }, data: { data: { post: { id: 1 } } } });
      const action = asyncGetPostDetail(1);
      const result = await action(dispatch);
      expect(result).toEqual({ id: 1 });
      expect(dispatch).toHaveBeenCalledWith(reducer.setPost({ id: 1 } as any));
    });

    it('should handle detail fetch failure', async () => {
      (postApi.getPostDetailApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncGetPostDetail(1);
      await expect(action(dispatch)).rejects.toThrow('Error');
    });
  });

  describe('asyncAddPost', () => {
    it('should add post successfully', async () => {
      (postApi.addPostApi as any).mockResolvedValue({ response: { ok: true }, data: { success: true } });
      const action = asyncAddPost({ description: 'Test' });
      const result = await action(dispatch);
      expect(result).toEqual({ success: true });
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });

    it('should handle add post failure', async () => {
      (postApi.addPostApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncAddPost({ description: 'Test' });
      await expect(action(dispatch)).rejects.toThrow('Error');
      expect(toolsHelper.showErrorDialog).toHaveBeenCalled();
    });
  });

  describe('asyncUpdatePost', () => {
    it('should update post successfully', async () => {
      (postApi.updatePostApi as any).mockResolvedValue({ response: { ok: true }, data: { success: true } });
      dispatch.mockImplementation((action: any) => {
        if (typeof action === 'function') return Promise.reject(new Error('fail'));
        return true;
      });
      const action = asyncUpdatePost({ id: 1, description: 'Test' });
      await action(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });

    it('should handle update post failure', async () => {
      (postApi.updatePostApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncUpdatePost({ id: 1, description: 'Test' });
      await expect(action(dispatch)).rejects.toThrow('Error');
      expect(toolsHelper.showErrorDialog).toHaveBeenCalled();
    });
  });

  describe('asyncUpdatePostCover', () => {
    it('should update cover successfully', async () => {
      (postApi.updatePostCoverApi as any).mockResolvedValue({ response: { ok: true }, data: { success: true } });
      dispatch.mockImplementation((action: any) => {
        if (typeof action === 'function') return Promise.reject(new Error('fail'));
        return true;
      });
      const action = asyncUpdatePostCover({ id: 1, file: new File([''], '') });
      await action(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });

    it('should handle update cover failure', async () => {
      (postApi.updatePostCoverApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncUpdatePostCover({ id: 1, file: new File([''], '') });
      await expect(action(dispatch)).rejects.toThrow('Error');
      expect(toolsHelper.showErrorDialog).toHaveBeenCalled();
    });
  });

  describe('asyncDeletePost', () => {
    it('should delete post successfully', async () => {
      (postApi.deletePostApi as any).mockResolvedValue({ response: { ok: true }, data: { success: true } });
      const action = asyncDeletePost(1);
      await action(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });

    it('should handle delete post failure', async () => {
      (postApi.deletePostApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncDeletePost(1);
      await expect(action(dispatch)).rejects.toThrow('Error');
      expect(toolsHelper.showErrorDialog).toHaveBeenCalled();
    });
  });

  describe('asyncToggleLike', () => {
    it('should toggle like successfully', async () => {
      (postApi.toggleLikeApi as any).mockResolvedValue({ response: { ok: true }, data: { success: true } });
      const action = asyncToggleLike(1);
      await action(dispatch);
    });

    it('should handle toggle like failure', async () => {
      (postApi.toggleLikeApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncToggleLike(1);
      await expect(action(dispatch)).rejects.toThrow('Error');
    });
  });

  describe('asyncAddComment', () => {
    it('should add comment successfully', async () => {
      (postApi.addCommentApi as any).mockResolvedValue({ response: { ok: true }, data: { success: true } });
      dispatch.mockImplementation((action: any) => {
        if (typeof action === 'function') return Promise.reject(new Error('fail'));
        return true;
      });
      const action = asyncAddComment({ id: 1, comment: 'Test' });
      await action(dispatch);
    });

    it('should handle add comment failure', async () => {
      (postApi.addCommentApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncAddComment({ id: 1, comment: 'Test' });
      await expect(action(dispatch)).rejects.toThrow('Error');
      expect(toolsHelper.showErrorDialog).toHaveBeenCalled();
    });
  });

  describe('asyncDeleteComment', () => {
    it('should delete comment successfully', async () => {
      (postApi.deleteCommentApi as any).mockResolvedValue({ response: { ok: true }, data: { success: true } });
      dispatch.mockImplementation((action: any) => {
        if (typeof action === 'function') return Promise.reject(new Error('fail'));
        return true;
      });
      const action = asyncDeleteComment({ postId: 1, commentId: 1 });
      await action(dispatch);
    });

    it('should handle delete comment failure', async () => {
      (postApi.deleteCommentApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncDeleteComment({ postId: 1, commentId: 1 });
      await expect(action(dispatch)).rejects.toThrow('Error');
      expect(toolsHelper.showErrorDialog).toHaveBeenCalled();
    });
  });

  describe('asyncDeleteAllPosts', () => {
    it('should delete all posts successfully', async () => {
      (postApi.deleteAllPostsApi as any).mockResolvedValue({ response: { ok: true }, data: { success: true } });
      const action = asyncDeleteAllPosts();
      await action(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
    });

    it('should handle delete all posts failure', async () => {
      (postApi.deleteAllPostsApi as any).mockResolvedValue({ response: { ok: false }, data: { message: 'Error' } });
      const action = asyncDeleteAllPosts();
      await expect(action(dispatch)).rejects.toThrow('Error');
      expect(toolsHelper.showErrorDialog).toHaveBeenCalled();
    });
  });
});
