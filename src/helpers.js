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

const enableForm = (formEl, formInputEl, submitButtonEl) => {
  formEl.reset();
  formInputEl.removeAttribute('readonly');
  submitButtonEl.removeAttribute('disabled');
};

const disabledForm = (formInputEl, submitButtonEl) => {
  formInputEl.setAttribute('readonly', true);
  submitButtonEl.setAttribute('disabled', 'disabled');
};

export const setInputForm = (formEl, formInputEl, submitButtonEl, value) => {
  if (value === 'sending') {
    disabledForm(formInputEl, submitButtonEl);
  }

  if (value === 'filling') {
    enableForm(formEl, formInputEl, submitButtonEl);
  }
};
