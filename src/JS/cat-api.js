import axios from 'axios';

export { fetchBreeds, fetchCatByBreed };

axios.defaults.headers.common['x-api-key'] =
  'live_4npBR6A3M9xqaY4QppyDTpF2TJjigzmbh1XQo8pk2hwtrIpZrzSEGLUQ5og11SDc';

function fetchBreeds() {
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(resp => {
      return resp.data;
    })
    .catch(error => {
      console.log('Error', error.message);
    });
}

function fetchCatByBreed(breedId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(resp => {
      return resp.data;
    })
    .catch(error => {
      console.log(error.message);
    });
}
