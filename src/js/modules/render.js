import _ from 'lodash';

export default ({ feeds, posts }) => {
  const feedsNode = document.querySelector('.feeds');
  const postsNode = document.querySelector('.posts');
  const modalTitle = document.querySelector('#modal .modal-title');
  const modalBody = document.querySelector('#modal .modal-body');
  const modalReadFull = document.querySelector('#modal .full-article');

  const feedsHtml = feeds
    .map(({ title, description, link }) => (
      `<li class="list-group-item">
        <h3>${title}</h3>
        <p>${description}</p>
      </li>`
    ))
    .join('\n');

  feedsNode.innerHTML = `<h2>Фиды</h2><ul class="list-group mb-5">${feedsHtml}</ul>`;

  const itemsHtml = posts
    .map(({ id, title, url }) => (
      `<li class="list-group-item d-flex justify-content-between align-items-start">
        <a
          href="${url}"
          class="font-weight-bold"
          data-id="${id}"
          target="_blank"
          rel="noopener noreferrer"
          >${title}</a
        ><button
          type="button"
          class="btn btn-primary btn-sm"
          data-id="${id}"
          data-toggle="modal"
          data-target="#modal"
        >
          Просмотр
        </button>
      </li>`
    ))
    .join('\n');

  postsNode.innerHTML = `<h2>Посты</h2><ul class="list-group">${itemsHtml}</ul>`;

  const readMoreButtons = postsNode.querySelectorAll('[data-toggle="modal"]');

  readMoreButtons.forEach((button) => button.addEventListener('click', ({ target }) => {
    const targetId = target.dataset.id;
    const targetPost = _.find(posts, { id: targetId });

    modalTitle.innerHTML = targetPost.title;
    modalBody.innerHTML = targetPost.description;
    modalReadFull.setAttribute('href', targetPost.url);
  }));
};