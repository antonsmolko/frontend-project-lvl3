export const renderMessage = (feedbackEl, inputEl, success = true, message) => {
  feedbackEl.classList.toggle('text-success', success);
  feedbackEl.classList.toggle('text-danger', !success);
  feedbackEl.textContent = message;
  inputEl.classList.toggle('is-invalid', !success);
};

export const clearMessage = (feedbackEl, inputEl) => {
  feedbackEl.classList.remove('text-success', 'text-danger');
  feedbackEl.textContent = '';
  inputEl.classList.remove('is-invalid');
};

const toggleForm = (disabled) => {
  const input = document.querySelector('.form-control');
  const submitButton = document.querySelector('[type="submit"]');

  input.readOnly = disabled;
  submitButton.disabled = disabled;
};

export const setInputForm = (value) => {
  if (value === 'sending') {
    // formEl.reset();
    toggleForm(true);
  }

  if (value === 'filling') {
    // formEl.reset();
    toggleForm(false);
  }
};
