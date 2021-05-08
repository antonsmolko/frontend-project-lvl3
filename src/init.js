import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';

import getRSS from './http.js';
import onChange from './view.js';
import parse from './parser.js';

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
        form: {
          isValid: false,
          errorMessage: '',
        },
        process: {
            state: 'filling',
            response: {
              message: '',
              success: false
            }
        },
        rss: {
            feeds: [],
            posts: [],
            readPosts: new Set(),
        },
      };

      const watchedState = onChange(state);

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

      const validate = (url) => (
        schema(watchedState.rss.feeds).validate(url)
          .then(() => {
            setValidationStatus(true, '');
          })
          .catch(({ message }) => {
            setValidationStatus(false, message);
          })
      );

      const getRssAction = (url) => (
        getRSS(url)
          .then(({ data: { contents } }) => {
            const { feed, posts } = parse(url, contents);

            addRss(feed, posts);
            setResponseStatus(true, i18n.t('success.rss_loaded_succefully'));
          })
          .catch(({ message }) => {
            setResponseStatus(false, message);
          })
      );

      const getTrackedRssPosts = (url) => (
        getRSS(url)
          .then(({ data: { contents } }) => {
            const { posts } = parse(url, contents);

            return posts;
          })
          .catch(({ message }) => {
            setResponseStatus(false, message);
          })
      );

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const url = formData.get('url').trim();

        validate(url).then(() => {
          if (watchedState.form.isValid) {
            watchedState.process.state = 'sending';
            setResponseStatus(true, '');

            getRssAction(url)
              .then(() => {
                form.reset();
              })
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
    });
};

