import axios from 'axios';
import i18next from './i18next.js';

const request = {
  build: (url) => {
    const _get = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');

    _get.searchParams.set('url', url);
    _get.searchParams.set('disableCache', true);

    return _get.toString();
  }
}

export default (url) => axios
  .get(request.build(url), { timeout: 10000 })
  .catch((e) => {
    throw new Error(i18next.t('errors.network_error'));
  });
