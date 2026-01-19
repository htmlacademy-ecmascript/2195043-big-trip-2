import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import EmptyListMessageView from '../view/empty-list-message-view';
import PointItemContainerView from '../view/point-item-container-view';
import PointPresenter from './point-presenter.js';
import { render } from '../utils/render.js';
import { FilterType, filterPoints } from '../utils/index.js';

export default class BoardPresenter {
  #sortComponent = null;
  #listComponent = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointPresenters = [];
  #currentFilter = FilterType.EVERYTHING;

  constructor({ container, pointsModel, destinationsModel, offersModel }) {
    this.container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  #renderBoard() {
    const allPoints = this.#pointsModel.getPoints();
    const filteredPoints = filterPoints(allPoints, this.#currentFilter);

    if (filteredPoints.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderPointsList(filteredPoints);
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
    this.#clearComponents();
    
    this.#sortComponent = new SortView();
    this.#listComponent = new ListView();
    
    render(this.#sortComponent, this.container);
    render(this.#listComponent, this.container);

    this.#renderPoints(points);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });
    this.#pointPresenters = [];
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
        offersModel: this.#offersModel
      });

      this.#pointPresenters.push(pointPresenter);
      pointPresenter.init();
    });
  }

  init() {
    this.#renderBoard();
  }

  destroy() {
    this.#clearPoints();
    this.#clearComponents();
  }
}
