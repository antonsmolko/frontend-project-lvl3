import onChange from 'on-change';
import render from './render.js';
import { renderMessage, toggleForm, clearFeedback } from './helpers.js';

export default (state, i18n) => onChange(state, (path, value) => {
  const form = document.querySelector('form.rss-form');

  if (path === 'process.state') {
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
      default: {
        throw new Error('Unknown status!');
      }
    }
  }

  if (path === 'rss.posts' || path === 'rss.feeds') {
    render(state.rss, i18n);
  }
});
