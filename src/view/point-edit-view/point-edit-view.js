import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { createPointEditTemplate } from './point-edit-template.js';

const FLATPICKR_DATE_FORMAT = 'd/m/y H:i';
const MIN_TRIP_DURATION_MS = 60 * 1000;

export default class PointEditView extends AbstractStatefulView {
  #onFormSubmit = null;
  #onFormClose = null;
  #handlersRestored = false;
  #model = null;
  #dateFromPicker = null;
  #dateToPicker = null;

  constructor(point = {}, destination = null, model, onFormSubmit, onFormClose) {
    super();
    this._setState({
      point: { ...point },
      destination: destination
    });
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

  removeElement() {
    this.#dateFromPicker?.destroy();
    this.#dateFromPicker = null;
    this.#dateToPicker?.destroy();
    this.#dateToPicker = null;
    super.removeElement();
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

    const priceInput = element.querySelector('input[name="event-price"]');
    if (priceInput) {
      priceInput.addEventListener('input', this.#priceChangeHandler);
    }

    const offerCheckboxes = element.querySelectorAll('.event__available-offers input[type="checkbox"]');
    offerCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', this.#offerChangeHandler);
    });

    this.#initDatePickers(element);
  }

  #initDatePickers(element) {
    const startDateInput = element.querySelector('#event-start-time-1');
    const endDateInput = element.querySelector('#event-end-time-1');

    if (!startDateInput || !endDateInput) {
      return;
    }

    const defaultStartDate = this._state.point.date_from ? new Date(this._state.point.date_from) : null;
    const defaultEndDate = this._state.point.date_to ? new Date(this._state.point.date_to) : null;
    const minEndDate = defaultStartDate
      ? new Date(defaultStartDate.getTime() + MIN_TRIP_DURATION_MS)
      : new Date();
    const maxStartDate = defaultEndDate
      ? new Date(defaultEndDate.getTime() - MIN_TRIP_DURATION_MS)
      : undefined;

    const flatpickrConfig = {
      enableTime: true,
      dateFormat: FLATPICKR_DATE_FORMAT,
      'time_24hr': true,
      defaultDate: null
    };

    this.#dateFromPicker = flatpickr(startDateInput, {
      ...flatpickrConfig,
      defaultDate: defaultStartDate,
      maxDate: maxStartDate,
      onChange: (selectedDates) => {
        if (selectedDates[0]) {
          this._setState({
            point: { ...this._state.point, date_from: selectedDates[0].toISOString() }
          });
          this.#dateToPicker.set('minDate', new Date(selectedDates[0].getTime() + MIN_TRIP_DURATION_MS));
        }
      }
    });

    this.#dateToPicker = flatpickr(endDateInput, {
      ...flatpickrConfig,
      defaultDate: defaultEndDate,
      minDate: minEndDate,
      onChange: (selectedDates) => {
        if (selectedDates[0]) {
          this._setState({
            point: { ...this._state.point, date_to: selectedDates[0].toISOString() }
          });
          this.#dateFromPicker.set('maxDate', new Date(selectedDates[0].getTime() - MIN_TRIP_DURATION_MS));
        }
      }
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit?.(this.#getFormData());
  };

  #getFormData() {
    const priceInput = this.element?.querySelector('input[name="event-price"]');
    const basePrice = priceInput ? parseInt(priceInput.value, 10) || 0 : this._state.point.base_price || 0;

    return {
      type: this._state.point.type || 'flight',
      destination: this._state.destination?.id ?? this._state.point.destination,
      date_from: this._state.point.date_from,
      date_to: this._state.point.date_to,
      base_price: basePrice,
      offers: this._state.point.offers || []
    };
  }

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

  #priceChangeHandler = (evt) => {
    const value = parseInt(evt.target.value, 10) || 0;
    this._setState({
      point: { ...this._state.point, base_price: value }
    });
  };

  #offerChangeHandler = (evt) => {
    const checkbox = evt.target;
    const offerId = checkbox.name.replace(/^event-offer-/, '');
    const currentOffers = this._state.point.offers || [];

    const newOffers = checkbox.checked
      ? [...currentOffers, offerId]
      : currentOffers.filter((id) => id !== offerId);

    this._setState({
      point: { ...this._state.point, offers: newOffers }
    });
  };
}
