export const renderMessage = ({ status, message }) => {
  const inputEl = document.querySelector('.form-control');
  const feedbackEl = document.querySelector('.feedback');

  feedbackEl.classList.toggle('text-success', status);
  feedbackEl.classList.toggle('text-danger', !status);
  feedbackEl.textContent = message;
  inputEl.classList.toggle('is-invalid', !status);
};

export const clearFeedback = () => {
  const inputEl = document.querySelector('.form-control');
  const feedbackEl = document.querySelector('.feedback');

  feedbackEl.classList.remove('text-success', 'text-danger');
  feedbackEl.textContent = '';
  inputEl.classList.remove('is-invalid');
};

export const toggleForm = (formEl, disabled) => {
  const input = formEl.querySelector('.form-control');
  const submitButton = formEl.querySelector('button[aria-label="add"][type="submit"]');

  input.readOnly = disabled;
  submitButton.disabled = disabled;
};
