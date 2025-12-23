import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8081';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
});

const formatError = (error) => {
  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;
    if (status === 404) return 'Meme not found (404).';
    if (status === 409) return 'A meme with these details already exists (409).';
    if (status === 400) return 'Invalid input (400). Please check caption and URL.';
  }
  return 'Something went wrong. Please try again.';
};

const safeRequest = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    throw new Error(formatError(error));
  }
};

export const fetchMemes = async () =>
  safeRequest(async () => {
    const { data } = await client.get('/memes');
    return Array.isArray(data) ? data : [];
  });

export const getMeme = async (id) =>
  safeRequest(async () => {
    if (!id) throw new Error('Meme id is required to fetch details.');
    const { data } = await client.get(`/memes/${id}`);
    return data;
  });

export const createMeme = async (payload) =>
  safeRequest(async () => {
    const { data } = await client.post('/memes', payload);
    if (data && data.id) return { ...payload, id: data.id };
    return data;
  });

export const updateMeme = async (id, payload) =>
  safeRequest(async () => {
    if (!id) throw new Error('Meme id is required for update.');
    await client.patch(`/memes/${id}`, payload);
    return true;
  });

export const deleteMeme = async (id) =>
  safeRequest(async () => {
    if (!id) throw new Error('Meme id is required for delete.');
    await client.delete(`/memes/${id}`);
    return true;
  });

