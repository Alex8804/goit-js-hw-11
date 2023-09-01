import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
// Functions
import { serchImgs, incrementPage, resetPage } from './search-api';
// Variables
import { currentPage, limitPerPage } from './search-api';

Notify.init({
  fontSize: '18px',
  width: '350px',
  timeout: 5000,
});

const elements = {
  form: document.querySelector('#search-form'),
  searchBtn: document.querySelector('.search-btn'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  loader: document.querySelector('.loader'),
};

const lightBoxOpt = {
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
};

const simpleGallery = new SimpleLightbox('.gallery a', lightBoxOpt);

let searchValue = '';

elements.form.addEventListener('submit', onSearchClick);

function onSearchClick(evt) {
  evt.preventDefault();
  elements.gallery.innerHTML = '';
  resetPage();
  elements.loader.classList.remove('js-visible');
  elements.loadMoreBtn.classList.add('js-visible');

  searchValue = evt.currentTarget.elements.searchQuery.value;

  serchImgs(searchValue)
    .then(data => {
      elements.loader.classList.add('js-visible');

      if (data.total === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (data.total <= limitPerPage) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        elements.gallery.innerHTML = createMarkup(data.hits);
        simpleGallery.refresh();
      } else {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        elements.gallery.innerHTML = createMarkup(data.hits);
        elements.loadMoreBtn.classList.remove('js-visible');
        elements.loadMoreBtn.addEventListener('click', onLoadBtnClick);
        simpleGallery.refresh();
      }
    })
    .catch(error => {
      elements.loader.classList.add('js-visible');
      Notify.failure(error.message);
    });
}

function onLoadBtnClick(evt) {
  evt.preventDefault();
  incrementPage();
  elements.loadMoreBtn.classList.add('js-visible');

  serchImgs(searchValue, currentPage)
    .then(data => {
      let maxPage = Math.ceil(data.totalHits / limitPerPage);

      if (currentPage === maxPage) {
        elements.gallery.insertAdjacentHTML(
          'beforeend',
          createMarkup(data.hits)
        );

        simpleGallery.refresh();

        elements.loadMoreBtn.classList.add('js-visible');

        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        elements.gallery.insertAdjacentHTML(
          'beforeend',
          createMarkup(data.hits)
        );
        simpleGallery.refresh();
        elements.loadMoreBtn.classList.remove('js-visible');
      }

      smoothScroll();
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
      <a href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" width="320" height="200" /></a>
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

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
