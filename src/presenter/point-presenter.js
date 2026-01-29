import PointView from '../view/point-view/point-view.js';
import FormEditView from '../view/form-edit-view/form-edit-view.js';

export default class PointPresenter {
  #pointView = null;
  #formView = null;
  #container = null;
  #point = null;
  #destination = null;
  #selectedOffers = null;
  #destinationsModel = null;
  #offersModel = null;
  #onDataChange = null;
  #onModeChange = null;
  #isEditing = false;
  #escKeyDownHandler = null;

  constructor({ container, point, destination, selectedOffers, destinationsModel, offersModel, onDataChange, onModeChange }) {
    this.#container = container;
    this.#point = point;
    this.#destination = destination;
    this.#selectedOffers = selectedOffers;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
    this.#escKeyDownHandler = this.#handleEscKeyDown.bind(this);
  }

  get pointId() {
    return this.#point.id;
  }

  init() {
    this.#renderPointView();
  }

  #renderPointView() {
    this.#pointView = new PointView(
      this.#point,
      this.#destination,
      this.#selectedOffers,
      () => this.#switchToEditMode(),
      () => this.#handleFavoriteClick()
    );

    this.#clearContainer();
    this.#container.append(this.#pointView.element);
    this.#isEditing = false;
  }

  #handleFavoriteClick() {
    this.#onDataChange?.({ is_favorite: !this.#point.is_favorite });
  }

  #renderFormView() {
    this.#formView = new FormEditView(
      this.#point,
      this.#destination,
      {
        getOffersByType: (type) => this.#offersModel.getOffersByType(type),
        getDestinations: () => this.#destinationsModel.getDestinations()
      },
      () => this.#switchToViewMode(),
      () => this.#switchToViewMode()
    );

    this.#clearContainer();
    this.#container.append(this.#formView.element);
    this.#isEditing = true;
    this.#setEventHandlers();
  }

  #switchToEditMode() {
    if (this.#isEditing) {
      return;
    }
    this.#onModeChange?.(this);
    this.#renderFormView();
  }

  #switchToViewMode() {
    if (!this.#isEditing) {
      return;
    }

    if (this.#formView) {
      this.#formView.removeElement();
      this.#formView = null;
    }

    this.#removeEventHandlers();
    this.#renderPointView();
  }

  #clearContainer() {
    while (this.#container.firstChild) {
      this.#container.firstChild.remove();
    }
  }

  #setEventHandlers() {
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #removeEventHandlers() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#switchToViewMode();
    }
  }

  updatePoint(point, destination, selectedOffers) {
    this.#point = point;
    this.#destination = destination;
    this.#selectedOffers = selectedOffers;

    if (!this.#isEditing && this.#pointView) {
      this.#pointView.removeElement();
      this.#pointView = null;
      this.#renderPointView();
    }
  }

  resetView() {
    if (this.#isEditing) {
      this.#switchToViewMode();
    }
  }

  destroy() {
    this.#removeEventHandlers();

    if (this.#formView) {
      this.#formView.removeElement();
    }
    if (this.#pointView) {
      this.#pointView.removeElement();
    }
  }
}
