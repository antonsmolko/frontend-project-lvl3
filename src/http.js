import axios from 'axios';
import i18next from './i18next.js';

export default (url) => axios
  .get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`, { timeout: 10000 })
  .catch(({ message }) => {
    throw new Error(message);
  });
