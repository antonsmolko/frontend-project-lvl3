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

const toggleForm = (formInputEl, submitButtonEl, disabled) => {
  formInputEl.readOnly = disabled;
  submitButtonEl.disabled = disabled;
};

export const setInputForm = (formEl, formInputEl, submitButtonEl, value) => {
  if (value === 'sending') {
    formEl.reset();
    toggleForm(formInputEl, submitButtonEl, true);
  }

  if (value === 'filling') {
    formEl.reset();
    toggleForm(formInputEl, submitButtonEl, false);
  }
};
