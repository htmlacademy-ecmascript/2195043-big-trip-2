import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';
import { UserAction } from '../utils';

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
  #onAddFormClose = null;
  #mode = PointMode.VIEW;
  #escKeyDownHandler = null;
  #isAddMode = false;

  constructor({ container, point, destination, selectedOffers, destinationsModel, offersModel, onDataChange, onModeChange, onAddFormClose, isAddMode = false }) {
    this.#container = container;
    this.#point = point;
    this.#destination = destination;
    this.#selectedOffers = selectedOffers;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
    this.#onAddFormClose = onAddFormClose;
    this.#isAddMode = isAddMode;
    this.#escKeyDownHandler = this.#handleEscKeyDown.bind(this);
  }

  get pointId() {
    return this.#point?.id;
  }

  init() {
    this.#renderPointView();
  }

  initAddForm() {
    this.#mode = PointMode.EDIT;
    this.#renderFormView(true);
    this.#setEventHandlers();
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

  #renderFormView(isAddMode = false) {
    this.#formView = new PointEditView(
      this.#point,
      this.#destination,
      {
        getOffersByType: (type) => this.#offersModel.getOffersByType(type),
        getDestinations: () => this.#destinationsModel.getDestinations()
      },
      (formData) => this.#handleFormSubmit(formData, isAddMode),
      () => this.#handleFormClose(isAddMode),
      isAddMode,
      () => this.#handleDeleteClick()
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
    this.#renderFormView(false);
  }

  async #handleFormSubmit(formData, isAddMode) {
    if (isAddMode && formData) {
       const result = this.#onDataChange?.({ type: UserAction.ADD, payload: formData });
      if (result instanceof Promise) {
        await result;
      }
    } else if (!isAddMode && formData) {
      const result = this.#onDataChange?.(formData);
      if (result instanceof Promise) {
        await result;
      }
    }
  }

  #handleFormClose(isAddMode) {
    this.#switchToViewMode(isAddMode);
    if (isAddMode) {
      this.#onAddFormClose?.();
    }
  }

  async #handleDeleteClick() {
    if (this.#point?.id) {
      const result = this.#onDataChange?.({ type: UserAction.DELETE });
      if (result instanceof Promise) {
        await result;
      }
    }
  }

  #switchToViewMode(isAddMode = false) {
    if (this.#mode === PointMode.VIEW && !isAddMode) {
      return;
    }

    if (this.#formView) {
      this.#formView.removeElement();
      this.#formView = null;
    }

    this.#removeEventHandlers();
    if (!isAddMode) {
      this.#renderPointView();
    }
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
      this.#switchToViewMode(this.#isAddMode);
      if (this.#isAddMode) {
        this.#onAddFormClose?.();
      }
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

  setFormState({ isSaving = false, isDeleting = false } = {}) {
    this.#formView?.updateElement({ isSaving, isDeleting });
  }

  shakeForm() {
    this.#formView?.shake();
  }

  resetView() {
    if (this.#mode === PointMode.EDIT) {
      this.#switchToViewMode(false);
    }
  }

  destroy() {
    this.#removeEventHandlers();

    if (this.#formView) {
      this.#formView.removeElement();
      this.#formView = null;
    }
    if (this.#pointView) {
      this.#pointView.removeElement();
      this.#pointView = null;
    }
  }
}
