import i18next from 'i18next';

i18next.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru: {
      translation: {
        success: {
          rss_loaded_succefully: 'RSS успешно загружен',
        },
        errors: {
          must_be_url: 'Ссылка должна быть валидным URL',
          rss_already_exists: 'RSS уже существует',
          does_not_contain_valid_rss: 'Ресурс не содержит валидный RSS',
          network_error: 'Ошибка сети'
        }
      }
    }
  }
});

export default i18next;