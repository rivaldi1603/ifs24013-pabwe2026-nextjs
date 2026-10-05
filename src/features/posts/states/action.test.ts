import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as actions from '../states/action';
import * as postApi from '../api/postApi';
import * as toolsHelper from '../../../helpers/toolsHelper';

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
    dispatch = vi.fn();
    vi.clearAllMocks();
  });

  it('asyncGetPosts handles success', async () => {
    (postApi.getPostsApi as any).mockResolvedValue({ response: { ok: true }, data: { data: [] } });
    const action = actions.asyncGetPosts();
    const result = await action(dispatch, () => ({}), undefined);
    expect(result.payload).toEqual([]);
  });

  it('asyncGetPostDetail handles success', async () => {
    (postApi.getPostDetailApi as any).mockResolvedValue({ response: { ok: true }, data: { data: { id: 1 } } });
    const action = actions.asyncGetPostDetail(1);
    const result = await action(dispatch, () => ({}), undefined);
    expect(result.payload).toEqual({ id: 1 });
  });

  it('asyncAddPost handles success', async () => {
    (postApi.addPostApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    const action = actions.asyncAddPost({ description: 'd' });
    await action(dispatch, () => ({}), undefined);
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
  });

  it('asyncAddPost handles error', async () => {
    (postApi.addPostApi as any).mockResolvedValue({ response: { ok: false }, data: {} });
    const action = actions.asyncAddPost({ description: 'd' });
    await action(dispatch, () => ({}), undefined);
    expect(toolsHelper.showErrorDialog).toHaveBeenCalled();
  });

  it('asyncUpdatePost handles success', async () => {
    (postApi.updatePostApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    const action = actions.asyncUpdatePost({ id: 1, description: 'd' });
    await action(dispatch, () => ({}), undefined);
    expect(dispatch).toHaveBeenCalled();
  });

  it('asyncUpdatePostCover handles success', async () => {
    (postApi.updatePostCoverApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    const action = actions.asyncUpdatePostCover({ id: 1, file: new File([''], '') });
    await action(dispatch, () => ({}), undefined);
    expect(dispatch).toHaveBeenCalled();
  });

  it('asyncDeletePost handles success', async () => {
    (postApi.deletePostApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    const action = actions.asyncDeletePost(1);
    await action(dispatch, () => ({}), undefined);
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
  });

  it('asyncToggleLike handles success', async () => {
    (postApi.toggleLikeApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    const action = actions.asyncToggleLike(1);
    await action(dispatch, () => ({}), undefined);
  });

  it('asyncAddComment handles success', async () => {
    (postApi.addCommentApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    const action = actions.asyncAddComment({ id: 1, comment: 'c' });
    await action(dispatch, () => ({}), undefined);
    expect(dispatch).toHaveBeenCalled();
  });

  it('asyncDeleteComment handles success', async () => {
    (postApi.deleteCommentApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    const action = actions.asyncDeleteComment({ postId: 1, commentId: 2 });
    await action(dispatch, () => ({}), undefined);
    expect(dispatch).toHaveBeenCalled();
  });

  it('asyncDeleteAllPosts handles success', async () => {
    (postApi.deleteAllPostsApi as any).mockResolvedValue({ response: { ok: true }, data: {} });
    const action = actions.asyncDeleteAllPosts();
    await action(dispatch, () => ({}), undefined);
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
  });

  it('asyncDeleteAllPosts handles error', async () => {
    (postApi.deleteAllPostsApi as any).mockRejectedValue(new Error('error'));
    const action = actions.asyncDeleteAllPosts();
    await action(dispatch, () => ({}), undefined);
    expect(toolsHelper.showErrorDialog).toHaveBeenCalled();
  });
});
