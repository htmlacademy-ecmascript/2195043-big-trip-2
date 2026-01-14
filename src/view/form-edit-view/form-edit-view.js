import AbstractView from '../../framework/view/abstract-view.js';
import { createFormEditTemplate } from './form-edit-template.js';

export default class FormEditView extends AbstractView {
  constructor(point = {}, destination = null, model) {
    super();
    this.point = point;
    this.destination = destination;
    this.model = model;
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
}

