import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { createPointEditTemplate } from './point-edit-template.js';

const FLATPICKR_DATE_FORMAT = 'd/m/y H:i';

export default class PointEditView extends AbstractStatefulView {
  #onFormSubmit = null;
  #onFormClose = null;
  #handlersRestored = false;
  #model = null;
  #dateFromPicker = null;
  #dateToPicker = null;

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
    const minEndDate = defaultStartDate ?? new Date();

    const flatpickrConfig = {
      enableTime: true,
      dateFormat: FLATPICKR_DATE_FORMAT,
      'time_24hr': true,
      defaultDate: null
    };

    this.#dateFromPicker = flatpickr(startDateInput, {
      ...flatpickrConfig,
      defaultDate: defaultStartDate,
      onChange: (selectedDates) => {
        if (selectedDates[0]) {
          this._state.point.date_from = selectedDates[0].toISOString();
          this.#dateToPicker.set('minDate', selectedDates[0]);
          const endDate = this._state.point.date_to ? new Date(this._state.point.date_to) : null;
          if (endDate && endDate < selectedDates[0]) {
            this._state.point.date_to = selectedDates[0].toISOString();
            this.#dateToPicker.setDate(selectedDates[0]);
          }
        }
      }
    });

    this.#dateToPicker = flatpickr(endDateInput, {
      ...flatpickrConfig,
      defaultDate: defaultEndDate,
      minDate: minEndDate,
      onChange: (selectedDates) => {
        if (selectedDates[0]) {
          this._state.point.date_to = selectedDates[0].toISOString();
        }
      }
    });
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
        offers: [] // Сбрасываем выбранные опции при смене типа
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
