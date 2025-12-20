import BoardPresenter from './presenter/board-presenter.js';

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const boardPresenter = new BoardPresenter({
  container: tripEventsElement,
  filtersContainer
});

boardPresenter.init();
