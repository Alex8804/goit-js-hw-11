import { Notify } from 'notiflix/build/notiflix-notify-aio';
// Functions
import { serchImgs, incrementPage, resetPage } from './search-api';
// Variables
import { currentPage, limitPerPage } from './search-api';

const elements = {
  form: document.querySelector('#search-form'),
  searchBtn: document.querySelector('.search-btn'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let searchValue = '';

elements.form.addEventListener('submit', onSearchBtnClick);

function onSearchBtnClick(evt) {
  evt.preventDefault();
  elements.gallery.innerHTML = '';
  resetPage();

  searchValue = evt.currentTarget.elements.searchQuery.value;

  serchImgs(searchValue)
    .then(data => {
      if (data.total === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        elements.gallery.innerHTML = createMarkup(data.hits);
        elements.loadMoreBtn.classList.remove('js-visible');
        elements.loadMoreBtn.addEventListener('click', onLoadBtnClick);
      }
    })
    .catch(error => console.log(error.message));
}

function onLoadBtnClick(evt) {
  evt.preventDefault();
  incrementPage();

  serchImgs(searchValue, currentPage)
    .then(data => {
      let maxPage = Math.ceil(data.totalHits / limitPerPage);
      console.log(maxPage);

      if (currentPage === maxPage) {
        elements.loadMoreBtn.classList.add('js-visible');
        console.log('no more');
      }

      elements.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    })
    .catch(err => console.log(err));
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="320" height="200" />
    <div class="info">
      <p class="info-item">
        <b>Likes: ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
  </div>`
    )
    .join('');
}
