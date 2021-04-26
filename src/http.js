import axios from 'axios';
import i18next from './i18next.js';

export default (url) => axios
  .get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`, { timeout: 10000 })
  .catch((e) => {
    console.log('url', url);
    console.log('error', e);
    throw new Error(i18next.t('errors.network_error'));
  });
