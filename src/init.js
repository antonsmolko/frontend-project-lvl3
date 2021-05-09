import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';

import getRSS from './http.js';
import parse from './parser.js';
import onChange from './view.js';

export default () => {
  const i18n = i18next.createInstance();

  return i18n.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru: {
        translation: {
          buttons: {
            viewing: 'Просмотр',
          },
          success: {
            rss_loaded_succefully: 'RSS успешно загружен',
          },
          errors: {
            should_not_be_empty: 'Не должно быть пустым',
            must_be_url: 'Ссылка должна быть валидным URL',
            rss_already_exists: 'RSS уже существует',
            does_not_contain_valid_rss: 'Ресурс не содержит валидный RSS',
            network_error: 'Ошибка сети',
          },
        },
      },
    },
  })
    .then(() => {
      let updateRssTimeout = null;

      const schema = (feeds) => (
        yup
          .string()
          .required()
          .url()
          .notOneOf(_.map(feeds, 'url'))
      );

      const state = {
        process: {
          state: 'filling',
          feedback: {
            message: '',
            status: false,
          },
        },
        rss: {
          feeds: [],
          posts: [],
          readPosts: new Set(),
        },
      };

      const watchedState = onChange(state, i18n);

      yup.setLocale({
        string: {
          url: i18n.t('errors.must_be_url'),
        },
        mixed: {
          required: i18n.t('errors.should_not_be_empty'),
          notOneOf: i18n.t('errors.rss_already_exists'),
        },
      });

      const form = document.querySelector('form.rss-form');
      const postsEl = document.querySelector('.posts');

      const addRss = (feed, posts) => {
        watchedState.rss.feeds.push(feed);
        watchedState.rss.posts.push(...posts);
      };

      const updateRss = (response) => {
        watchedState.rss.posts = _.unionBy(watchedState.rss.posts, ...response, 'url');
      };

      const setFeedback = (status, message) => {
        watchedState.process.feedback.status = status;
        watchedState.process.feedback.message = message;
      };

      const validate = (url) => {
        try {
          schema(watchedState.rss.feeds).validateSync(url);
          return null;
        } catch ({ message }) {
          return message;
        }
      };

      const getTrackedRssPosts = (url) => (
        getRSS(url, i18n)
          .then(({ data: { contents } }) => {
            const { posts } = parse(url, contents, i18n);

            return posts;
          })
          .catch(({ message }) => {
            setFeedback(false, message);
          })
      );

      const trackRss = () => {
        clearTimeout(updateRssTimeout);

        updateRssTimeout = setTimeout(() => {
          Promise
            .all(watchedState.rss.feeds.map(({ url }) => getTrackedRssPosts(url)))
            .then((response) => {
              updateRss(response);
              trackRss();
            });
        }, 5000);
      };

      const getRssAction = (url) => (
        getRSS(url, i18n)
          .then(({ data: { contents } }) => {
            setFeedback(true, i18n.t('success.rss_loaded_succefully'));

            const { feed, posts } = parse(url, contents, i18n);

            addRss(feed, posts);
            watchedState.process.state = 'sended';
          })
          .catch(({ message }) => {
            setFeedback(false, message);
            watchedState.process.state = 'failed';
          })
          .finally(() => {
            trackRss();
          })
      );

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const url = formData.get('url').trim();

        const error = validate(url);
        setFeedback(!error, error);

        if (error) {
          watchedState.process.state = 'failed';
          return;
        }

        watchedState.process.state = 'sending';

        getRssAction(url);
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
    });
};
