import onChange from 'on-change';
import render from './render.js';
import { renderMessage, clearMessage, setInputForm } from './helpers.js';

export default (state) => onChange(state, (path, value) => {
  const feedback = document.querySelector('.feedback');
  const formInput = document.querySelector('input[name="url"]');
  const submitButton = document.querySelector('button[type="submit"]');
  const form = document.querySelector('form.rss-form');

  if (path === 'process.state') {
    setInputForm(form, formInput, submitButton, value);
  }

  if (path === 'rss.posts' || path === 'rss.feeds') {
    render(state.rss);
  }

  if (path === 'message.body') {
    renderMessage(feedback, formInput, state.message.success, value);
  }
});
