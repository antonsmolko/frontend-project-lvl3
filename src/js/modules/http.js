import axios from 'axios';

export const getRSS = (url) => axios
  .get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`, { timeout: 10000 })
  .catch(() => {
    throw new Error('Ошибка сети');
  });