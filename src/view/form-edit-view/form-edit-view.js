import AbstractView from '../../framework/view/abstract-view.js';
import { createFormEditTemplate } from './form-edit-template.js';

export default class FormEditView extends AbstractView {
  #onFormSubmit = null;
  #onFormClose = null;
  #handlersSet = false;

  constructor(point = {}, destination = null, model, onFormSubmit, onFormClose) {
    super();
    this.point = point;
    this.destination = destination;
    this.model = model;
    this.#onFormSubmit = onFormSubmit;
    this.#onFormClose = onFormClose;
  }

  get template() {
    const type = this.point.type || 'flight';
    const availableOffers = this.model ? this.model.getOffersByType(type) : [];
    const destinations = this.model ? this.model.getDestinations() : [];
    const selectedOfferIds = this.point.offers || [];

    return createFormEditTemplate(
      this.point,
      this.destination,
      availableOffers,
      destinations,
      selectedOfferIds
    );
  }

  get element() {
    const element = super.element;
    if (!this.#handlersSet) {
      this.#setFormHandlers(element);
      this.#handlersSet = true;
    }
    return element;
  }

  #setFormHandlers(element) {
    const form = element.querySelector('.event--edit');
    if (form) {
      form.addEventListener('submit', this.#formSubmitHandler);
    }

    const rollupButton = element.querySelector('.event__rollup-btn');
    if (rollupButton) {
      rollupButton.addEventListener('click', this.#rollupClickHandler);
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
}

