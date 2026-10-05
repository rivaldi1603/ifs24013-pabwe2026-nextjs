import { fetchApi } from '../../../helpers/apiHelper';

export const loginApi = async (data: any) => {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    requiresAuth: false,
  });
};

export const registerApi = async (data: any) => {
  return fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
    requiresAuth: false,
  });
};
