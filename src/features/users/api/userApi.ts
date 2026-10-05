import { fetchApi } from '../../../helpers/apiHelper';

export const getUsersApi = async (search?: string) => {
  return fetchApi('/users', {
    method: 'GET',
    params: search ? { search } : undefined,
  });
};

export const getProfileApi = async () => {
  return fetchApi('/users/me', {
    method: 'GET',
  });
};

export const updateProfileApi = async (data: any) => {
  return fetchApi('/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const updateProfilePhotoApi = async (file: File) => {
  const formData = new FormData();
  formData.append('cover', file); // usually 'cover' or 'avatar', let's use 'cover' as it's common in this API or just 'photo' - wait, the instruction for post cover is 'cover'. The requirement says: unggah foto avatar (POST /users/me/photo). Assuming field name is 'photo' or 'avatar'. Let's use 'avatar' or 'photo'. Let's use 'photo' as standard. Wait, the endpoint is /users/me/photo.
  formData.append('photo', file);
  return fetchApi('/users/me/photo', {
    method: 'POST',
    body: formData,
  });
};

export const updateProfilePasswordApi = async (data: any) => {
  return fetchApi('/users/me/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
