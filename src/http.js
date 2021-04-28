import axios from 'axios';
import i18next from './i18next.js';

export default (url) => axios
  .get('https://hexlet-allorigins.herokuapp.com/get?url=https%3A%2F%2Fru.hexlet.io%2Flessons.rss&disableCache=true', { timeout: 10000 })
  .catch((error) => {
    console.log(error)
    throw new Error(i18next.t('errors.network_error'));
  });
