'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling

btnScrollTo.addEventListener('click', function() {
  section1.scrollIntoView({ behavior: 'smooth' });
})

///////////////////////////////////////
// Page navigation

// Adding event listener for all nav links
// document.querySelectorAll('.nav__link').forEach(function(el) {
//   el.addEventListener('click', function(e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   })
// })

// EVENT DELEGATION
document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();

  // Matching Case
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
})

///////////////////////////////////////
// Tabbed component

const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content')

tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');

  // Gaurd clause
  if (!clicked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tab => tab.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})


///////////////////////////////////////
// Menu fade animation

const nav = document.querySelector('nav');

const handleHover = function(e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const active = e.target;

    const links = document.querySelectorAll('.nav__link');
    links.forEach(link => {
      if (link !== active) link.style.opacity = this;
    })
  }
}
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));


///////////////////////////////////////
// Sticky navbar on Scroll

// TODO : Implement this using getBoundingClientRect

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const obsCallback = function(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const obsOptions = {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0
}

const headerObserver = new IntersectionObserver(obsCallback, obsOptions);

headerObserver.observe(header);


///////////////////////////////////////
// Sticky navbar on Scroll

const sections = document.querySelectorAll('.section')

const sectionObsCallback = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObsOptions = {
  root: null,
  threshold: 0.15,
}

const sectionObserver = new IntersectionObserver(sectionObsCallback, sectionObsOptions);

sections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden')
  // TODO : Uncomment above line
});


///////////////////////////////////////
// Lazy loading images

const imgTargets = document.querySelectorAll('.lazy-img');

const imgObserverCallback = function(entries, obsevrer) {
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img')
  })

  obsevrer.unobserve(entry.target);
}

const imgObserverOptions = {
  root: null,
  threshould: 0,
  rootMargin: '200px'
}

const imgObserver = new IntersectionObserver(imgObserverCallback, imgObserverOptions);

imgTargets.forEach(img => imgObserver.observe(img));


///////////////////////////////////////
// Slider component

const slides = document.querySelectorAll('.slide');

let currSlide = 0;
const maxSlide = slides.length;

const slider = document.querySelector('.slider');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotsContainer = document.querySelector('.dots');

// Functions
const createDots = function() {
  slides.forEach(function(slide, index) {
    dotsContainer.insertAdjacentHTML('beforeend',
    `<button class="dots__dot" data-slide=${index}></button>`)    
  })
}

const fillDot = function(dotNum) {
  const dots = document.querySelectorAll('.dots__dot');
  dots.forEach(dot => dot.classList.remove('dots__dot--active'));
  dots[dotNum].classList.add('dots__dot--active');
}

const showSlide = function(slideNum) {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - slideNum)}%)`;
  })

  fillDot(slideNum);
}

const prevSlide = function() {
  if (currSlide === 0) currSlide = maxSlide - 1;
  else currSlide--;

  showSlide(currSlide);
}

const nextSlide = function() {
  if (currSlide === maxSlide-1) currSlide = 0;
  else currSlide++;

  showSlide(currSlide);
}

// Init Function
const init = function() {
  createDots();
  showSlide(0);
  
}
init();


// Event Handlers
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e) {
  if (e.key == 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
})

dotsContainer.addEventListener('click', function(e) {
  if (e.target.classList.contains('dots__dot')) {
    const {slide} = e.target.dataset;
    showSlide(slide);
  }
})