import onChange from 'on-change';
import render from './render.js';
import { renderMessage, toggleFormByState } from './helpers.js';

export default (state, i18n) => onChange(state, (path, value) => {
  const feedback = document.querySelector('.feedback');
  const formInput = document.querySelector('input[name="url"]');
  const submitButton = document.querySelector('button[type="submit"]');
  const form = document.querySelector('form.rss-form');

  if (path === 'form.errorMessage') {
    renderMessage(feedback, formInput, state.form.isValid, value);
  }

  if (path === 'process.state') {
    toggleFormByState(form, value);
  }

  if (path === 'rss.posts' || path === 'rss.feeds') {
    render(state.rss, i18n);
  }

  if (path === 'process.response.message') {
    renderMessage(feedback, formInput, state.process.response.status, value);
  }
});
