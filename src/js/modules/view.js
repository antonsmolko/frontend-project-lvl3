import onChange from 'on-change';
import render from './render.js';

const submitButton = document.querySelector('button[type="submit"]');
const feedback = document.querySelector('.feedback');
const formInput = document.querySelector('input[name="url"]');
const form = document.querySelector('form.rss-form');

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
    watched: false
  },
  rss: {
    feeds: [],
    posts: [],
    readPosts: new Set()
  }
};

const renderMessage = (success = true, message) => {
  feedback.classList.toggle('text-success', success);
  feedback.classList.toggle('text-danger', !success);
  formInput.classList.toggle('is-invalid', !success);
  feedback.textContent = message;
}

const clearMessage = () => {
  feedback.classList.remove('text-success', 'text-danger');
  formInput.classList.remove('is-invalid');
  feedback.textContent = '';
}

const enableForm = () => {
  form.reset();
  formInput.removeAttribute('readonly');
  submitButton.removeAttribute('disabled');
};

const disabledForm = () => {
  formInput.setAttribute('readonly', true);
  submitButton.setAttribute('disabled', 'disabled');
};

const setInputForm = (value) => {
  if (value === 'sending') {
    disabledForm();
  }

  if (value === 'filling') {
    enableForm();
  }
};

export default onChange(state, async (path, value) => {
  if (path === 'form.errorMessage') {
    state.form.isValid
      ? clearMessage()
      : renderMessage(false, value)
  }

  if (path === 'process.state') {
    setInputForm(value);
  }

  if (path === 'rss.posts' || path === 'rss.feeds') {
      render(state.rss);
  }

  if (path === 'process.response.message') {
      renderMessage(state.process.response.status, value);
  }
});