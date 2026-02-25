import FilterPresenter from './filter-presenter.js';
import BoardPresenter from './board-presenter.js';
import PointsModel from '../model/points-model.js';
import DestinationsModel from '../model/destinations-model.js';
import OffersModel from '../model/offers-model.js';
import FilterModel from '../model/filter-model.js';
import LoadingMessageView from '../view/loading-message-view/loading-message-view.js';
import FailedLoadMessageView from '../view/failed-load-message-view/failed-load-message-view.js';
import { render } from '../utils/render.js';
import { FilterType } from '../utils';

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

export default class MainPresenter {
  #pointsModel;
  #destinationsModel;
  #offersModel;
  #filterPresenter;
  #boardPresenter;

  constructor(api) {
    const pointsModel = new PointsModel(api);
    const destinationsModel = new DestinationsModel(api);
    const offersModel = new OffersModel(api);
    const filterModel = new FilterModel();

    this.#filterPresenter = new FilterPresenter({
      container: filtersElement,
      pointsModel,
      filterModel
    });

    this.#boardPresenter = new BoardPresenter({
      container: tripEventsElement,
      pointsModel,
      destinationsModel,
      offersModel,
      filterModel,
      newEventButton,
      onResetFilter: () => this.#filterPresenter.setFilter(FilterType.EVERYTHING),
      onPointsChange: () => this.#filterPresenter.setFilter()
    });

    this.#filterPresenter.onFilterChange = () => {
      this.#boardPresenter.setFilter();
    };

    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  async init() {
    const loadingView = new LoadingMessageView();
    render(loadingView, tripEventsElement);

    try {
      await Promise.all([
        this.#pointsModel.init(),
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
    } catch {
      loadingView.removeElement();
      const failedView = new FailedLoadMessageView();
      render(failedView, tripEventsElement);
      return;
    }

    loadingView.removeElement();
    this.#filterPresenter.init();
    this.#boardPresenter.init();
  }
}
