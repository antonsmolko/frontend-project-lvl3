import * as yup from 'yup';
import _ from 'lodash';
import i18next from './modules/i18next.js';

import { getRSS } from './modules/http.js';
import watchedState from './modules/view.js';
import parser from './modules/parser.js';

yup.setLocale({
  string: {
    url: i18next.t('errors.must_be_url'),
  },
  mixed: {
    notOneOf: i18next.t('errors.rss_already_exists'),
  },
});

const schema = (feeds) => (
  yup
    .string()
    .url()
    .notOneOf(_.map(feeds, 'url'))
);

const formInput = document.querySelector('input[name="url"]');
const form = document.querySelector('form.rss-form');

const setValidationStatus = (isValid, message) => {
  watchedState.form.isValid = isValid;
  watchedState.form.errorMessage = message;
};

const addRss = (feed, posts) => {
  watchedState.rss.feeds.push(feed);
  watchedState.rss.posts.push(...posts);
};

const updateRss = (response) => {
  watchedState.rss.posts = _.unionBy(watchedState.rss.posts, ...response, 'url');
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

    addRss(feed, posts);
    setResponseStatus(true, i18next.t('success.rss_loaded_succefully'));

  } catch ({ message }) {
    setResponseStatus(false, message);
  }
};

const getTrackedRssPosts = async (url) => {
  try {
    const { data } = await getRSS(url);
    const { posts } = parser(data);

    return posts;
  } catch ({ message }) {
    setResponseStatus(false, message);
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

const trackRss = () => {
  setTimeout(async () => {
    const response = await Promise
      .all(watchedState.rss.feeds.map(({ url }) => getTrackedRssPosts(url)))
      .then(() => {
        trackRss();
      })

    updateRss(response);
  }, 5000);
};

trackRss();