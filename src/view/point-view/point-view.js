import AbstractView from '../../framework/view/abstract-view.js';
import { createPointTemplate } from './point-template.js';

export default class PointView extends AbstractView {
  constructor(point, destination, selectedOffers) {
    super();
    this.point = point;
    this.destination = destination;
    this.selectedOffers = selectedOffers;
  }

  get template() {
    return createPointTemplate(this.point, this.destination, this.selectedOffers);
  }
}

