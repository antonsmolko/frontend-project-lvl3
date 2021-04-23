import * as yup from 'yup';
import _ from 'lodash'

import { getRSS } from './modules/http.js';
import watchedState from './modules/view.js';
import parser from './modules/parser.js';

const schema = (feeds) => (
  yup
    .string()
    .url('Ссылка должна быть валидным URL')
    .notOneOf(_.map(feeds, 'url'), 'RSS уже существует')
);

const formInput = document.querySelector('input[name="url"]');
const form = document.querySelector('form.rss-form');

const setValidationStatus = (isValid, message) => {
  watchedState.form.isValid = isValid;
  watchedState.form.errorMessage = message;
};

const setRss = (feed, posts) => {
  watchedState.rss.feeds.push(feed);
  watchedState.rss.posts.push(...posts);
};

const setResponseStatus = (status, message) => {
  watchedState.process.response.status = status;
  watchedState.process.response.message = message;
};

const validate = async () => {
  try {
    await schema(watchedState.rss.feeds).validateSync(watchedState.form.url);

    setValidationStatus(true, '');
  } catch ({ message }) {
    setValidationStatus(false, message);
  }
};

const getRssAction = async (url) => {
  try {
    const { data } = await getRSS(url);
    const { feed, posts } = parser(data);

    setRss(feed, posts);
    setResponseStatus('success', 'RSS успешно загружен');

  } catch ({ message }) {
    setResponseStatus('error', message);
  }
};


formInput.addEventListener('input', async ({ target: { value } }) => {
  watchedState.form.url = value.trim();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  await validate();

  if (watchedState.form.isValid) {
    watchedState.process.state = 'sending';

    await getRssAction(watchedState.form.url)
      .finally(() => {
        watchedState.process.state = 'filling';
      });
  }
});