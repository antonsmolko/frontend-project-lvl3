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

const toggleForm = (formEl, disabled) => {
  const input = formEl.querySelector('.form-control');
  const submitButton = formEl.querySelector('button[aria-label="add"][type="submit"]');

  input.readOnly = disabled;
  submitButton.disabled = disabled;
  console.log('submitButton = ', submitButton.disabled)
};

export const setInputForm = (formEl, value) => {
  if (value === 'sending') {
    // formEl.reset();
    toggleForm(formEl, true);
  }

  if (value === 'filling') {
    // formEl.reset();
    toggleForm(formEl, false);
  }
};
