import Notiflix from 'notiflix';
const axios = require('axios');
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  submitBtn: document.querySelector('.js-submit'),
  gallery: document.querySelector('.gallery'),
};
const BASE_URl = `https://pixabay.com/api/`;
const KEY = '29878778-792a80536ef138b77329a15b8';
let searchQuery = '';
let page = 1;

async function fetchGalleryPic(searchQuery, page) {
  try {
    let result = await axios.get(
      `${BASE_URl}?key=${KEY}&q=${searchQuery}&page=${page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`
    );
    return result;
  } catch {
    error => console.log(error);
  }
}
function makeGalleryMarkUp(images) {
  const markUpImage = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `  <a href="${largeImageURL}" class="gallery__link"
      ><div class="photo-card">
        <img src="${webformatURL}"  alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>likes: <span>${likes}</span> </b>
          </p>
          <p class="info-item">
            <b>views: <span>${views}</span> </b>
          </p>
          <p class="info-item">
            <b>comments: <span>${comments}</span> </b>
          </p>
          <p class="info-item">
            <b>downloads: <span>${downloads}</span> </b>
          </p>
        </div>
      </div></a
    >`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeEnd', markUpImage);

  const cards = document.querySelector('.gallery__link:last-child');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        page += 1;
        fetchGalleryPic(searchQuery, page)
          .then(({ data }) => {
            if (data.totalHits === 0) {
              Notiflix.Notify.warning(
                'Sorry, there are no images matching your search query. Please try again.'
              );
            }
            makeGalleryMarkUp(data.hits);
            smoothScroll();
            new SimpleLightbox('.gallery a').refresh();
          })
          .catch(error => console.log(error))
          .finally(() => refs.form.reset());
        observer.unobserve(entry.target);
      }
    });

    //
  });
  console.log(cards);
  observer.observe(cards);
  //
}

function onSearch(event) {
  event.preventDefault();
  page = 1;
  searchQuery = event.currentTarget.elements.searchQuery.value.trim();

  resetGallery();

  if (searchQuery === '') {
    Notiflix.Notify.failure('Plzz , enter something');
  } else {
    fetchGalleryPic(searchQuery, page)
      .then(({ data }) => {
        if (data.totalHits === 0) {
          Notiflix.Notify.warning(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
        makeGalleryMarkUp(data.hits);

        Notiflix.Notify.success(`Hooray! We found ${data.totalHits}+ images.`);

        new SimpleLightbox('.gallery a').refresh();
      })
      .catch(error => console.log(error))
      .finally(() => refs.form.reset());
  }
}

function resetGallery() {
  return (refs.gallery.innerHTML = '');
}

// function onScroll() {
//   const documentRect = document.documentElement.getBoundingClientRect();

//   if (documentRect.bottom < document.documentElement.clientHeight + 150) {
// page += 1;

// fetchGalleryPic(searchQuery, page)
//   .then(({ data }) => {
//     console.log(data.hits);
//     makeGalleryMarkUp(data.hits);

//     new SimpleLightbox('.gallery a').refresh();

//     let endOfPages = Math.ceil(data.totalHits / 40);
//     if (page === endOfPages) {
//       Notiflix.Notify.warning(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }
//   })
//   .catch(error => console.log(error))
//   .finally(() => refs.form.reset());
//   }
// }

refs.form.addEventListener('submit', onSearch);

// window.addEventListener('scroll', onScroll);
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.3,
    behavior: 'smooth',
  });
}
