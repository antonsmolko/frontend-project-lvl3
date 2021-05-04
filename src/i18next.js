import i18next from 'i18next';

const i18nextInstance = i18next.createInstance();

i18nextInstance.init({
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
});

export default i18nextInstance;
