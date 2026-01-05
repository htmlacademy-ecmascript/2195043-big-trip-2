import View from '../view.js';
import { createFormEditTemplate } from './form-edit-template.js';

export default class FormEditView extends View {
  constructor(point = {}, destination = null, availableOffers = [], destinations = [], selectedOfferIds = []) {
    super();
    this.point = point;
    this.destination = destination;
    this.availableOffers = availableOffers;
    this.destinations = destinations;
    this.selectedOfferIds = selectedOfferIds;
  }

  getTemplate() {
    return createFormEditTemplate(
      this.point,
      this.destination,
      this.availableOffers,
      this.destinations,
      this.selectedOfferIds
    );
  }
}

