export const renderMessage = (success = true, message) => {
  const inputEl = document.querySelector('.form-control');
  const feedbackEl = document.querySelector('.feedback');

  feedbackEl.classList.toggle('text-success', success);
  feedbackEl.classList.toggle('text-danger', !success);
  feedbackEl.textContent = message;
  inputEl.classList.toggle('is-invalid', !success);
};

export const clearFeedback = () => {
  const inputEl = document.querySelector('.form-control');
  const feedbackEl = document.querySelector('.feedback');

  feedbackEl.classList.remove('text-success', 'text-danger');
  feedbackEl.textContent = '';
  inputEl.classList.remove('is-invalid');
};

// const clearFeedback = () => {
//   const input = document.querySelector('.form-control');
//   const feedback = document.querySelector('.feedback');

//   feedback.textContent = '';
//   feedback.classList.remove('text-danger', 'text-success');
//   input.classList.remove('is-invalid');
// };

const toggleForm = (formEl, disabled) => {
  const input = formEl.querySelector('.form-control');
  const submitButton = formEl.querySelector('button[aria-label="add"][type="submit"]');

  input.readOnly = disabled;
  submitButton.disabled = disabled;
  console.log('submitButton = ', submitButton.disabled)
};

export const toggleFormByState = (formEl, value) => {
  if (value === 'sending') {
    formEl.reset();
    clearFeedback();
    return toggleForm(formEl, true);
  }

  if (value === 'filling') {
    formEl.reset();
    clearFeedback();
    return toggleForm(formEl, false);
  }
};
