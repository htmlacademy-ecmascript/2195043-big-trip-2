import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { createPointEditTemplate } from './point-edit-template.js';

export default class PointEditView extends AbstractStatefulView {
  #onFormSubmit = null;
  #onFormClose = null;
  #handlersRestored = false;
  #model = null;

  constructor(point = {}, destination = null, model, onFormSubmit, onFormClose) {
    super();
    this._state = {
      point: { ...point },
      destination: destination
    };
    this.#model = model;
    this.#onFormSubmit = onFormSubmit;
    this.#onFormClose = onFormClose;
  }

  get element() {
    const element = super.element;
    if (!this.#handlersRestored) {
      this.#handlersRestored = true;
      this._restoreHandlers();
    }
    return element;
  }

  get template() {
    const type = this._state.point.type || 'flight';
    const availableOffers = this.#model ? this.#model.getOffersByType(type) : [];
    const destinations = this.#model ? this.#model.getDestinations() : [];
    const selectedOfferIds = this._state.point.offers || [];

    return createPointEditTemplate(
      this._state.point,
      this._state.destination,
      availableOffers,
      destinations,
      selectedOfferIds
    );
  }

  _restoreHandlers() {
    const element = super.element;

    const form = element.querySelector('.event--edit');
    if (form) {
      form.addEventListener('submit', this.#formSubmitHandler);
    }

    const rollupButton = element.querySelector('.event__rollup-btn');
    if (rollupButton) {
      rollupButton.addEventListener('click', this.#rollupClickHandler);
    }

    const typeInputs = element.querySelectorAll('input[name="event-type"]');
    typeInputs.forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });

    const destinationInput = element.querySelector('.event__input--destination');
    if (destinationInput) {
      destinationInput.addEventListener('change', this.#destinationChangeHandler);
    }
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit?.();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFormClose?.();
  };

  #typeChangeHandler = (evt) => {
    const newType = evt.target.value;
    this.updateElement({
      point: {
        ...this._state.point,
        type: newType,
        offers: []
      }
    });
  };

  #destinationChangeHandler = (evt) => {
    const destinationName = evt.target.value;
    if (!this.#model) {
      return;
    }

    const destinations = this.#model.getDestinations();
    const destination = destinations.find(dest => dest.name === destinationName);

    if (destination) {
      this.updateElement({
        destination: destination
      });
    }
  };
}
