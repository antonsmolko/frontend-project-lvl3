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
  // formInputEl.removeAttribute('readonly');
  // submitButtonEl.disabled = false;
};

const disabledForm = (formInputEl, submitButtonEl) => {
  formEl.reset();
  // formInputEl.setAttribute('readonly', true);
  // submitButtonEl.disabled = true;
};

export const setInputForm = (formEl, formInputEl, submitButtonEl, value) => {
  if (value === 'sending') {
    formEl.reset();
    // disabledForm(formInputEl, submitButtonEl);
  }

  if (value === 'filling') {
    formEl.reset();
    // enableForm(formEl, formInputEl, submitButtonEl);
  }
};
