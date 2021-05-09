import onChange from 'on-change';
import render from './render.js';
import { renderMessage, toggleForm, clearFeedback } from './helpers.js';

export default (state, i18n) => onChange(state, (path, value) => {
  const feedback = document.querySelector('.feedback');
  const formInput = document.querySelector('input[name="url"]');
  const submitButton = document.querySelector('button[type="submit"]');
  const form = document.querySelector('form.rss-form');

  if (path === 'process.state') {
    // toggleFormByState(form, value);
    switch (value) {
      case 'filling':
        toggleForm(form, false);
        clearFeedback();
        break;
      case 'failed':
        toggleForm(form, false);
        renderMessage(state.process.feedback);
        break;
      case 'sending':
        form.reset();
        toggleForm(form, true);
        clearFeedback();
        break;
      case 'sended':
        toggleForm(form, false);
        clearFeedback();
        renderMessage(state.process.feedback);
        break;
    }
  // } else if (path === 'form.errorMessage') {
  //   renderMessage(state.form.isValid, value);
  } else if (path === 'rss.posts' || path === 'rss.feeds') {
    render(state.rss, i18n);
  }
  // } else if (path === 'process.response.message') {
  //   renderMessage(state.process.response.status, value);
  // }
});
