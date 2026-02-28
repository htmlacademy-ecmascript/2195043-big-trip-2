import FilterPresenter from './filter-presenter.js';
import BoardPresenter from './board-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';
import PointsModel from '../model/points-model.js';
import DestinationsModel from '../model/destinations-model.js';
import OffersModel from '../model/offers-model.js';
import FilterModel from '../model/filter-model.js';
import LoadingMessageView from '../view/loading-message-view/loading-message-view.js';
import FailedLoadMessageView from '../view/failed-load-message-view/failed-load-message-view.js';
import { render } from '../utils/render.js';
import { FilterType } from '../utils';

const tripEventsElement = document.querySelector('.page-main')?.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

export default class MainPresenter {
  #pointsModel;
  #destinationsModel;
  #offersModel;
  #filterPresenter;
  #boardPresenter;
  #tripInfoPresenter;

  constructor(api) {
    const pointsModel = new PointsModel(api);
    const destinationsModel = new DestinationsModel(api);
    const offersModel = new OffersModel(api);
    const filterModel = new FilterModel();

    this.#tripInfoPresenter = new TripInfoPresenter({
      container: tripMainElement,
      pointsModel,
      destinationsModel,
      offersModel,
      filterModel
    });

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
      onPointsChange: () => {
        this.#filterPresenter.setFilter();
        this.#tripInfoPresenter.update();
      }
    });

    this.#filterPresenter.onFilterChange = () => {
      this.#boardPresenter.setFilter();
      this.#tripInfoPresenter.update();
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
      const loadingEl = loadingView.element;
      if (loadingEl?.parentNode) {
        loadingEl.remove();
      }
      loadingView.removeElement();
      const failedView = new FailedLoadMessageView();
      render(failedView, tripEventsElement);
      return;
    }

    const loadingEl = loadingView.element;
    if (loadingEl?.parentNode) {
      loadingEl.remove();
    }
    loadingView.removeElement();
    this.#filterPresenter.init();
    this.#boardPresenter.init();
    this.#tripInfoPresenter.init();
  }
}
