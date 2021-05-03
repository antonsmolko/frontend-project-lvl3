import * as yup from 'yup';
import _ from 'lodash';
import i18next from './i18next.js';

import getRSS from './http.js';
import onChange from './view.js';
import parser from './parser.js';

const state = {
  form: {
    url: '',
    isValid: false,
    errorMessage: null,
  },
  process: {
    state: 'filling',
    response: {
      message: '',
      status: '',
    },
    watched: false,
  },
  rss: {
    feeds: [],
    posts: [],
    readPosts: new Set(),
  },
};

let updateRssTimeout = null;
const watchedState = onChange(state);

export default () => {
  yup.setLocale({
    string: {
      url: i18next.t('errors.must_be_url'),
    },
    mixed: {
      required: i18next.t('errors.should_not_be_empty'),
      notOneOf: i18next.t('errors.rss_already_exists'),
    },
  });

  const schema = (feeds) => (
    yup
      .string()
      .required()
      .url()
      .notOneOf(_.map(feeds, 'url'))
  );

  const form = document.querySelector('form.rss-form');
  const formInput = form.querySelector('input');
  const postsEl = document.querySelector('.posts');

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

  const validate = () => {
    console.log('FEEDS --- ', watchedState.rss.feeds);
    console.log('URL --- ', watchedState.form.url);

    return schema(watchedState.rss.feeds).validate(watchedState.form.url)
      .then(() => {
        setValidationStatus(true, '');
      })
      .catch(({ message }) => {
        setValidationStatus(false, message);
      })
  };

  const getRssAction = (url) => (
    getRSS(url)
      .then(({ data: { contents } }) => {
        const { feed, posts } = parser(url, contents);

        addRss(feed, posts);
        setResponseStatus(true, i18next.t('success.rss_loaded_succefully'));
      })
      .catch(({ message }) => {
        setResponseStatus(false, message);
      })
  );

  const getTrackedRssPosts = (url) => (
    getRSS(url)
      .then(({ data: { contents } }) => {
        const { posts } = parser(url, contents);

        return posts;
      })
      .catch(({ message }) => {
        setResponseStatus(false, message);
      })
  );

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    validate().then(() => {
      if (watchedState.form.isValid) {
        watchedState.process.state = 'sending';

        getRssAction(watchedState.form.url)
          .finally(() => {
            trackRss();

            watchedState.process.state = 'filling';
          });
      }
    });
  });

  postsEl.addEventListener('click', ({ target }) => {
    if (target.hasAttribute('data-id')) {
      const { id } = target.dataset;
      const targetLink = target.closest('li').querySelector(`a[data-id="${id}"]`);

      targetLink.classList.remove('font-weight-bold');
      targetLink.classList.add('font-weight-normal');

      watchedState.rss.readPosts.add(id);
    }
  });

  formInput.addEventListener('input', ({ target: { value } }) => {
    watchedState.form.url = value.trim();
  });

  const trackRss = () => {
    clearTimeout(updateRssTimeout);
    console.log('UPDATE')

    updateRssTimeout = setTimeout(() => {
      Promise
        .all(watchedState.rss.feeds.map(({ url }) => getTrackedRssPosts(url)))
        .then((response) => {
          updateRss(response);
          trackRss();
        });
    }, 5000);
  };
};
