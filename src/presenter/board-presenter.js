import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import EmptyListMessageView from '../view/empty-list-message-view';
import FormEditView from '../view/form-edit-view';
import PointView from '../view/point-view';
import { render } from '../utils/render.js';
import { FilterType, filterPoints } from '../utils/index.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  listComponent = new ListView();
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointComponents = new Map();
  #currentEditingPointId = null;
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
    this.#pointComponents.clear();
    this.container.innerHTML = '';
    const emptyListComponent = new EmptyListMessageView(this.#currentFilter);
    render(emptyListComponent, this.container);
  }

  setFilter(filterType) {
    this.#currentFilter = filterType;
    this.#renderBoard();
  }

  #renderPointsList(points) {
    this.#pointComponents.clear();
    
    if (this.sortComponent.element && this.container.contains(this.sortComponent.element)) {
      this.sortComponent.removeElement();
    }
    if (this.listComponent.element && this.container.contains(this.listComponent.element)) {
      this.listComponent.removeElement();
    }
    
    this.container.innerHTML = '';
    
    this.sortComponent = new SortView();
    this.listComponent = new ListView();
    
    render(this.sortComponent, this.container);
    render(this.listComponent, this.container);

    this.#renderPoints(points);
  }

  #renderPoints(points) {
    points.forEach((point) => {
      const destination = this.#destinationsModel.getDestinationById(point.destination);
      const availableOffers = this.#offersModel.getOffersByType(point.type);
      const selectedOffers = availableOffers.filter((offer) =>
        point.offers.includes(offer.id)
      );

      const pointComponent = new PointView(
        point,
        destination,
        selectedOffers,
        () => this.#replacePointToForm(point)
      );

      this.#pointComponents.set(point.id, { pointComponent, formComponent: null });

      render(
        pointComponent,
        this.listComponent.element
      );
    });
  }

  #replacePointToForm(point) {
    const destination = this.#destinationsModel.getDestinationById(point.destination);

    const formComponent = new FormEditView(
      point,
      destination,
      {
        getOffersByType: (type) => this.#offersModel.getOffersByType(type),
        getDestinations: () => this.#destinationsModel.getDestinations()
      },
      () => this.#replaceFormToPoint(point.id),
      () => this.#replaceFormToPoint(point.id)
    );

    const components = this.#pointComponents.get(point.id);
    const pointElement = components.pointComponent.element;
    const formElement = formComponent.element;

    pointElement.replaceWith(formElement);

    components.formComponent = formComponent;
    this.#currentEditingPointId = point.id;

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint(pointId) {
    const components = this.#pointComponents.get(pointId);
    if (!components || !components.formComponent) {
      return;
    }

    const formElement = components.formComponent.element;
    const pointElement = components.pointComponent.element;

    formElement.replaceWith(pointElement);

    components.formComponent.removeElement();
    components.formComponent = null;
    this.#currentEditingPointId = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      if (this.#currentEditingPointId) {
        this.#replaceFormToPoint(this.#currentEditingPointId);
      }
    }
  };

  init() {
    this.#renderBoard();
  }
}
