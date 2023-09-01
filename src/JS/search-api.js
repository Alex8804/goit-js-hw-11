import axios from 'axios';
// Functions
export { serchImgs, incrementPage, resetPage };
// Variables
export { currentPage, limitPerPage };

let currentPage = 1;
let limitPerPage = 40;

async function serchImgs(searchValue) {
  const API_KEY = '39171765-ec3dc9a0b13eb9a19bc461d25';
  const BASE_URL = 'https://pixabay.com/api/';

  const params = new URLSearchParams({
    key: API_KEY,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: limitPerPage,
    page: currentPage,
  });

  const resp = await axios(`${BASE_URL}?${params}`);
  return resp.data;
}

function incrementPage() {
  currentPage += 1;
}

function resetPage() {
  currentPage = 1;
}
