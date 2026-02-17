import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';

const PointMode = { VIEW: 'view', EDIT: 'edit' };

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
  #mode = PointMode.VIEW;
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
    this.#mode = PointMode.VIEW;
  }

  #handleFavoriteClick() {
    this.#onDataChange?.({ is_favorite: !this.#point.is_favorite });
  }

  #renderFormView() {
    this.#formView = new PointEditView(
      this.#point,
      this.#destination,
      {
        getOffersByType: (type) => this.#offersModel.getOffersByType(type),
        getDestinations: () => this.#destinationsModel.getDestinations()
      },
      (formData) => this.#handleFormSubmit(formData),
      () => this.#switchToViewMode()
    );

    this.#clearContainer();
    this.#container.append(this.#formView.element);
    this.#mode = PointMode.EDIT;
    this.#setEventHandlers();
  }

  #switchToEditMode() {
    if (this.#mode === PointMode.EDIT) {
      return;
    }
    this.#onModeChange?.(this);
    this.#renderFormView();
  }

  #handleFormSubmit(formData) {
    if (formData) {
      this.#onDataChange?.(formData);
    }
    this.#switchToViewMode();
  }

  #switchToViewMode() {
    if (this.#mode === PointMode.VIEW) {
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

    if (this.#mode === PointMode.VIEW && this.#pointView) {
      this.#pointView.removeElement();
      this.#pointView = null;
      this.#renderPointView();
    }
  }

  resetView() {
    if (this.#mode === PointMode.EDIT) {
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
