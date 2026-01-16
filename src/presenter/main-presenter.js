import FilterPresenter from './filter-presenter.js';
import BoardPresenter from './board-presenter.js';
import PointsModel from '../model/points-model.js';
import DestinationsModel from '../model/destinations-model.js';
import OffersModel from '../model/offers-model.js';

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const filtersElement = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const filterPresenter = new FilterPresenter({
  container: filtersElement,
  pointsModel
});

const boardPresenter = new BoardPresenter({
  container: tripEventsElement,
  pointsModel,
  destinationsModel,
  offersModel
});

filterPresenter.onFilterChange = (filterType) => {
  boardPresenter.setFilter(filterType);
};

export default class MainPresenter {
  async init() {
    await Promise.all([
      pointsModel.init(),
      destinationsModel.init(),
      offersModel.init()
    ]);

    filterPresenter.init();
    boardPresenter.init();
  }
}
