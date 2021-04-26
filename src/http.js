import axios from 'axios';
import i18next from './i18next.js';

export default (url) => axios
  .get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, { timeout: 10000 })
  .catch(() => {
    throw new Error(i18next.t('errors.network_error'));
  });
