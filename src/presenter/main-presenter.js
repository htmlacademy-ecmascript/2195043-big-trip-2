import FilterPresenter from './filter-presenter.js';
import BoardPresenter from './board-presenter.js';

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const filtersElement = document.querySelector('.trip-controls__filters');

const filterPresenter = new FilterPresenter({container: filtersElement});
const boardPresenter = new BoardPresenter({container: tripEventsElement});

export default class MainPresenter {
  init () {
    filterPresenter.init();
    boardPresenter.init();
  }
}
