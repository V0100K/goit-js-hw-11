import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import config from './config';

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
};
const galleryMarkup = array => {
    const markup = array
        .map(
            item =>
                `<div class="photo-card">
        <a href=${item.largeImageURL}>
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes: </b>${item.likes}
      </p>
      <p class="info-item">
        <b>Views: </b>${item.views}
      </p>
      <p class="info-item">
        <b>Comments: </b>${item.comments}
      </p>
      <p class="info-item">
        <b>Downloads: </b>${item.downloads}
      </p>
    </div>
    </div>`,
        )
        .join('');

    refs.gallery.insertAdjacentHTML('beforeend', markup);

    lightbox.refresh();
};

const clearData = () => {
    refs.gallery.innerHTML = '';
};
const key = new config();
const lightbox = new SimpleLightbox('.gallery a', {
    captions: false,
});

const getData = data => {
    const totalPages = Math.ceil(data.totalHits / key.per_page);
    if (data.totalHits === 0) {
        clearData();
        refs.loadMore.classList.add('visually-hidden');
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
    }

    if (key.page === totalPages && data.totalHits > 40) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        refs.loadMore.classList.add('visually-hidden');
        return data.hits;
    }

    if (data.hits.length > 0) {
        if (key.page === 1 && data.totalHits > 40) {
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }
        if (key.page === 1 && data.totalHits <= 40) {
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
            refs.loadMore.classList.add('visually-hidden');
            return data.hits;
        }
        refs.loadMore.classList.remove('visually-hidden');
        return data.hits;
    }
};

const showGallery = async () => {
    return key.fetchGallery();
};

const showNextGallery = async () => {
    key.incrementPage();
    return key.fetchGallery();
};

refs.searchForm.addEventListener('submit', async e => {
    e.preventDefault();
    clearData();
    refs.loadMore.classList.add('visually-hidden');
    key.page = 1;
    const searchQuery = e.currentTarget.elements.searchQuery.value;
    key.newInput = searchQuery.trim();

    const dataResult = await showGallery().catch(err => console.log(err));
    galleryMarkup(getData(dataResult));
});

refs.loadMore.addEventListener('click', async e => {
    const dataResult = await showNextGallery().catch(err => console.log(err));
    galleryMarkup(getData(dataResult));
});
