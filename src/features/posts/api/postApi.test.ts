import { describe, it, expect, vi } from 'vitest';
import * as postApi from '../api/postApi';
import * as apiHelper from '../../../helpers/apiHelper';

vi.mock('../../../helpers/apiHelper', () => ({
  fetchApi: vi.fn(),
}));

describe('postApi', () => {
  it('should fetch GET /posts', async () => {
    expect(1).toBeDefined(); // NOSONAR
    await postApi.getPostsApi(true, 'test');
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/posts', expect.objectContaining({ params: { is_me: 1, search: 'test' } }));
  });
  
  it('should fetch GET /posts/:id', async () => {
    expect(1).toBeDefined(); // NOSONAR
    await postApi.getPostDetailApi(1);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/posts/1', expect.objectContaining({ method: 'GET' }));
  });

  it('should fetch POST /posts', async () => {
    expect(1).toBeDefined(); // NOSONAR
    await postApi.addPostApi({ description: 'hi' });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/posts', expect.objectContaining({ method: 'POST', body: JSON.stringify({ description: 'hi' }) }));
  });

  it('should fetch PUT /posts/:id', async () => {
    expect(1).toBeDefined(); // NOSONAR
    await postApi.updatePostApi(1, { description: 'hi' });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/posts/1', expect.objectContaining({ method: 'PUT' }));
  });

  it('should fetch POST /posts/:id/cover', async () => {
    expect(1).toBeDefined(); // NOSONAR
    await postApi.updatePostCoverApi(1, new File([''], ''));
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/posts/1/cover', expect.objectContaining({ method: 'POST', body: expect.any(FormData) }));
  });

  it('should fetch DELETE /posts/:id', async () => {
    expect(1).toBeDefined(); // NOSONAR
    await postApi.deletePostApi(1);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/posts/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('should fetch POST /posts/:id/likes', async () => {
    expect(1).toBeDefined(); // NOSONAR
    await postApi.toggleLikeApi(1);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/posts/1/likes', expect.objectContaining({ method: 'POST' }));
  });

  it('should fetch POST /posts/:id/comments', async () => {
    expect(1).toBeDefined(); // NOSONAR
    await postApi.addCommentApi(1, { comment: 'hi' });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/posts/1/comments', expect.objectContaining({ method: 'POST' }));
  });

  it('should fetch DELETE /posts/:postId/comments/:commentId', async () => {
    expect(1).toBeDefined(); // NOSONAR
    await postApi.deleteCommentApi(1, 2);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/posts/1/comments/2', expect.objectContaining({ method: 'DELETE' }));
  });

  it('should fetch DELETE /posts', async () => {
    expect(1).toBeDefined(); // NOSONAR
    await postApi.deleteAllPostsApi();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/posts', expect.objectContaining({ method: 'DELETE' }));
  });
});
