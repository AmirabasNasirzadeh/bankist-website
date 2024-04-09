"use strict";

//////////////////// Selecting Elements ////////////////////

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const header = document.querySelector(".header");

//////////////////// Modal window ////////////////////

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((modal) => modal.addEventListener(`click`, openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//////////////////// Smooth Scroll ////////////////////

btnScrollTo.addEventListener(`click`, function (e) {
  /* const section1Coords = section1.getBoundingClientRect();
  
  scrollTo({
    left: section1Coords.left + window.pageXOffset,
    top: section1Coords.top + window.pageYOffset,
    behavior: `smooth`,
  }); */

  section1.scrollIntoView({ behavior: `smooth` });
});

//////////////////// Navigation ////////////////////

document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  e.preventDefault();

  if (e.target.classList.contains(`nav__link`)) {
    const id = e.target.getAttribute(`href`);
    document.querySelector(id).scrollIntoView({ behavior: `smooth` });
  }
});

//////////////////// Tabbed Component ////////////////////

tabsContainer.addEventListener(`click`, function (e) {
  const clicked = e.target.closest(`.operations__tab`);

  // Guard Clause
  if (!clicked) return;

  // Remove Active classes
  tabs.forEach((e) => e.classList.remove(`operations__tab--active`));
  tabsContent.forEach((e) => e.classList.remove(`operations__content--active`));

  // Add Active Classes
  clicked.classList.add(`operations__tab--active`);
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add(`operations__content--active`);
});

//////////////////// Navigationbar Hover ////////////////////

const hover = function (e, opacity) {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    siblings.forEach((sibling) => {
      if (sibling !== link) sibling.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener(`mouseover`, function (e) {
  hover(e, 0.5);
});

nav.addEventListener(`mouseout`, function (e) {
  hover(e, 1);
});

//////////////////// Sticky Navigation ////////////////////

const navigtionHeight = nav.getBoundingClientRect().height;
const observerOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navigtionHeight}px`,
};

const navObserverCallback = function (entries) {
  const [entry] = entries;

  if (entry.isIntersecting === false) {
    nav.classList.add(`sticky`);
  } else {
    nav.classList.remove(`sticky`);
  }
};

const navObserver = new IntersectionObserver(navObserverCallback, observerOptions);
navObserver.observe(header);

//////////////////// Revealing Elements On Scroll ////////////////////

const allSections = document.querySelectorAll(`.section`);

const revealingObserverCallback = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};

const revealingObserver = new IntersectionObserver(revealingObserverCallback, { root: null, threshold: 0.15 });

allSections.forEach((section) => {
  section.classList.add(`section--hidden`);
  revealingObserver.observe(section);
});

//////////////////// Lazy Loading Images ////////////////////

const imgTargets = document.querySelectorAll(`img[data-src]`);

const imgObserverCallback = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgObserverCallback, { root: null, threshold: 0 });
imgTargets.forEach((img) => imgObserver.observe(img));

//////////////////// Slider Component ////////////////////

let currentSlide = 0;

const allSlides = document.querySelectorAll(`.slide`);

const goToSlide = function (curr) {
  allSlides.forEach((slide, index) => (slide.style.transform = `translateX(${100 * (index - curr)}%)`));
};
goToSlide(0);

const sliderBtnRight = document.querySelector(`.slider__btn--right`);
const sliderBtnLeft = document.querySelector(`.slider__btn--left`);

const addActiveDot = function (slideNum) {
  const allSlides = document.querySelectorAll(`.dots__dot`);
  allSlides.forEach((e) => e.classList.remove(`dots__dot--active`));
  document.querySelector(`button[data-slide="${slideNum}"]`).classList.add(`dots__dot--active`);
};

const goRight = function () {
  if (currentSlide === allSlides.length - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  addActiveDot(currentSlide);
};
sliderBtnRight.addEventListener(`click`, goRight);

const goLeft = function () {
  if (currentSlide === 0) {
    currentSlide = allSlides.length - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  addActiveDot(currentSlide);
};
sliderBtnLeft.addEventListener(`click`, goLeft);

document.addEventListener(`keydown`, function (e) {
  if (e.key === `ArrowLeft`) goLeft();
  else goRight();
});

const dotsContainer = document.querySelector(`.dots`);

const createDots = function () {
  allSlides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(`beforeend`, `<button class="dots__dot" data-slide="${i}"></button>`);
  });
};

createDots();
addActiveDot(0);

dotsContainer.addEventListener(`click`, function (e) {
  if (e.target.classList.contains(`dots__dot`)) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    addActiveDot(slide);
  }
});
