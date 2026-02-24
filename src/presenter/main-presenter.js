import FilterPresenter from './filter-presenter.js';
import BoardPresenter from './board-presenter.js';
import PointsModel from '../model/points-model.js';
import DestinationsModel from '../model/destinations-model.js';
import OffersModel from '../model/offers-model.js';
import FilterModel from '../model/filter-model.js';
import { FilterType } from '../utils';

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  container: filtersElement,
  pointsModel,
  filterModel
});

const boardPresenter = new BoardPresenter({
  container: tripEventsElement,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  newEventButton,
  onResetFilter: () => filterPresenter.setFilter(FilterType.EVERYTHING),
  onPointsChange: () => filterPresenter.setFilter()
});

filterPresenter.onFilterChange = () => {
  boardPresenter.setFilter();
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
