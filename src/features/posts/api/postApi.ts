import { fetchApi } from '../../../helpers/apiHelper';

export const getPostsApi = async (is_me?: boolean, search?: string) => {
  const params: any = {};
  if (is_me) params.is_me = 1;
  if (search) params.search = search;
  return fetchApi('/posts', { method: 'GET', params });
};

export const getPostDetailApi = async (id: number) => {
  return fetchApi(`/posts/${id}`, { method: 'GET' });
};

export const addPostApi = async (data: { description: string }) => {
  return fetchApi('/posts', { method: 'POST', body: JSON.stringify(data) });
};

export const updatePostApi = async (id: number, data: { description: string }) => {
  return fetchApi(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const updatePostCoverApi = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append('cover', file);
  return fetchApi(`/posts/${id}/cover`, { method: 'POST', body: formData });
};

export const deletePostApi = async (id: number) => {
  return fetchApi(`/posts/${id}`, { method: 'DELETE' });
};

export const toggleLikeApi = async (id: number) => {
  return fetchApi(`/posts/${id}/likes`, { method: 'POST' });
};

export const addCommentApi = async (id: number, data: { comment: string }) => {
  return fetchApi(`/posts/${id}/comments`, { method: 'POST', body: JSON.stringify(data) });
};

export const deleteCommentApi = async (postId: number, commentId: number) => {
  // Assuming the endpoint is /posts/:id/comments/:commentId based on REST conventions
  // If the API strictly uses /posts/:id/comments and expects commentId in body or query, adjust accordingly.
  return fetchApi(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
};

export const deleteAllPostsApi = async () => {
  return fetchApi('/posts', { method: 'DELETE' });
};
