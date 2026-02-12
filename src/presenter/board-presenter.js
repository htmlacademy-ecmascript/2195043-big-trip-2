import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import EmptyListMessageView from '../view/empty-list-message-view';
import PointItemContainerView from '../view/point-item-container-view';
import PointPresenter from './point-presenter.js';
import { render } from '../utils/render.js';
import { FilterType, filterPoints } from '../utils';

export default class BoardPresenter {
  #sortComponent = null;
  #listComponent = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointPresenters = new Map();
  #currentFilter = FilterType.EVERYTHING;
  #currentSortType = 'day';

  constructor({ container, pointsModel, destinationsModel, offersModel }) {
    this.container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  #renderBoard() {
    const allPoints = this.#pointsModel.getPoints();
    const filteredPoints = filterPoints(allPoints, this.#currentFilter);
    const sortedPoints = this.#sortPoints(filteredPoints);

    if (sortedPoints.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderPointsList(sortedPoints);
    }
  }

  #renderEmptyList() {
    this.#clearPoints();
    this.#clearComponents();
    
    const emptyListComponent = new EmptyListMessageView(this.#currentFilter);
    render(emptyListComponent, this.container);
  }

  setFilter(filterType) {
    this.#currentFilter = filterType;
    this.#renderBoard();
  }

  #renderPointsList(points) {
    this.#clearPoints();
    
    if (!this.#sortComponent) {
      this.#sortComponent = new SortView(
        this.#currentSortType,
        (sortType) => this.#handleSortTypeChange(sortType)
      );
      render(this.#sortComponent, this.container);
    }
    
    if (!this.#listComponent) {
      this.#listComponent = new ListView();
      render(this.#listComponent, this.container);
    }

    this.#renderPoints(points);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #clearComponents() {
    if (this.#sortComponent) {
      this.#sortComponent.removeElement();
      this.#sortComponent = null;
    }
    if (this.#listComponent) {
      this.#listComponent.removeElement();
      this.#listComponent = null;
    }
    
    while (this.container.firstChild) {
      this.container.firstChild.remove();
    }
  }

  #clearListOnly() {
    if (this.#listComponent && this.#listComponent.element) {
      this.#listComponent.element.innerHTML = '';
    }
  }

  #getPointData(point) {
    const destination = this.#destinationsModel.getDestinationById(point.destination);
    const availableOffers = this.#offersModel.getOffersByType(point.type);
    const selectedOffers = availableOffers.filter((offer) =>
      point.offers.includes(offer.id)
    );

    return { destination, availableOffers, selectedOffers };
  }

  #renderPoints(points) {
    points.forEach((point) => {
      const { destination, selectedOffers } = this.#getPointData(point);

      const pointItemContainerView = new PointItemContainerView();
      render(pointItemContainerView, this.#listComponent.element);

      const pointPresenter = new PointPresenter({
        container: pointItemContainerView.element,
        point,
        destination,
        selectedOffers,
        destinationsModel: this.#destinationsModel,
        offersModel: this.#offersModel,
        onDataChange: (update) => this.#handlePointChange(point.id, update),
        onModeChange: (currentPresenter) => this.#handleModeChange(currentPresenter)
      });

      this.#pointPresenters.set(point.id, pointPresenter);
      pointPresenter.init();
    });
  }

  #handlePointChange(pointId, patch) {
    this.#pointsModel.patchPoint({ id: pointId, ...patch });
    const point = this.#pointsModel.getPoints().find((p) => p.id === pointId);
    if (point) {
      const presenter = this.#pointPresenters.get(pointId);
      if (presenter) {
        const { destination, selectedOffers } = this.#getPointData(point);
        presenter.updatePoint(point, destination, selectedOffers);
      }
    }
  }

  #handleModeChange(currentPresenter) {
    this.#resetAllPointsToViewMode(currentPresenter);
  }

  #resetAllPointsToViewMode(currentPresenter) {
    this.#pointPresenters.forEach((presenter) => {
      if (presenter !== currentPresenter) {
        presenter.resetView();
      }
    });
  }

  #handleSortTypeChange(sortType) {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    
    const allPoints = this.#pointsModel.getPoints();
    const filteredPoints = filterPoints(allPoints, this.#currentFilter);
    const sortedPoints = this.#sortPoints(filteredPoints);
    
    this.#clearPoints();
    this.#clearListOnly();
    this.#renderPoints(sortedPoints);
  }

  #sortPoints(points) {
    const sortedPoints = [...points];

    switch (this.#currentSortType) {
      case 'day':
        sortedPoints.sort((a, b) => {
          const dateA = new Date(a.date_from);
          const dateB = new Date(b.date_from);
          return dateA - dateB;
        });
        break;
      case 'time':
        sortedPoints.sort((a, b) => {
          const durationA = new Date(a.date_to) - new Date(a.date_from);
          const durationB = new Date(b.date_to) - new Date(b.date_from);
          return durationB - durationA;
        });
        break;
      case 'price':
        sortedPoints.sort((a, b) => b.base_price - a.base_price);
        break;
      default:
        break;
    }

    return sortedPoints;
  }

  init() {
    this.#renderBoard();
  }

  destroy() {
    this.#clearPoints();
    this.#clearComponents();
  }
}
