import Notiflix from 'notiflix';
const axios = require('axios');
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

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
        return `<a href="${largeImageURL}" class="gallery__link"
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
  Notiflix.Loading.circle('Loading....');
  refs.gallery.insertAdjacentHTML('beforeEnd', markUpImage);
  // =================================================================intersectionObserver()=======================================
  // const cards = document.querySelector('.gallery__link:last-child');
  // const observer = new IntersectionObserver((entries, observer) => {
  //   entries.forEach(entry => {
  //     if (entry.isIntersecting) {
  //       page += 1;
  //       smoothScroll();
  //       Notiflix.Loading.circle('Loading....');
  //       fetchGalleryPic(searchQuery, page)
  //         .then(({ data }) => {
  //           if (data.totalHits === 0) {
  //             Notiflix.Notify.warning(
  //               'Sorry, there are no images matching your search query. Please try again.'
  //             );
  //           }
  //           makeGalleryMarkUp(data.hits);

  //           new SimpleLightbox('.gallery a').refresh();
  //         })
  //         .catch(error => console.log(error))
  //         .finally(() => refs.form.reset());
  //       observer.unobserve(entry.target);
  //     }
  //   });

  //   //
  // });
  // console.log(cards);
  // observer.observe(cards);
  // Notiflix.Loading.remove();
  // ===============================================================================================intersectionObserver finish==========
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
      .finally(() => {
        Notiflix.Loading.remove();
        refs.form.reset();
      });
  }
}

function resetGallery() {
  return (refs.gallery.innerHTML = '');
}
// ====================================================onScrollEvent(bad practice)==============================================
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
// ==========================================================================================tui pagination()==================
const options = {
  totalItems: 500,
  itemsPerPage: 40,
  visiblePages: 5,
  page: 1,
  centerAlign: false,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  template: {
    page: '<a href="#" class="tui-page-btn">{{page}}</a>',
    currentPage:
      '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<a href="#" class="tui-page-btn tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</span>',
    moreButton:
      '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
      '<span class="tui-ico-ellip">...</span>' +
      '</a>',
  },
};

const pagination = new Pagination('pagination', options);

pagination.on('afterMove', function (eventData) {
  resetGallery();
  fetchGalleryPic(searchQuery, eventData.page)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      makeGalleryMarkUp(data.hits);

      new SimpleLightbox('.gallery a').refresh();
    })
    .catch(error => console.log(error))
    .finally(() => {
      Notiflix.Loading.remove();
      refs.form.reset();
    });
});
// ===============================================================================================tui pagination stop=========
