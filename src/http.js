import axios from 'axios';

export default (url, i18n) => axios
  .get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`, { timeout: 10000 })
  .catch(() => {
    throw new Error(i18n.t('errors.network_error'));
  });