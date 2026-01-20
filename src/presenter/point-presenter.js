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
  #isEditing = false;
  #escKeyDownHandler = null;

  constructor({ container, point, destination, selectedOffers, destinationsModel, offersModel }) {
    this.#container = container;
    this.#point = point;
    this.#destination = destination;
    this.#selectedOffers = selectedOffers;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#escKeyDownHandler = this.#handleEscKeyDown.bind(this);
  }

  init() {
    this.#renderPointView();
  }

  #renderPointView() {
    this.#pointView = new PointView(
      this.#point,
      this.#destination,
      this.#selectedOffers,
      () => this.#switchToEditMode()
    );

    this.#clearContainer();
    this.#container.append(this.#pointView.element);
    this.#isEditing = false;
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
