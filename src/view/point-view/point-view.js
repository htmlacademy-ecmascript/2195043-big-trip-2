import View from '../view.js';
import { createPointTemplate } from './point-template.js';

export default class PointView extends View {
  constructor(point, destination, selectedOffers) {
    super();
    this.point = point;
    this.destination = destination;
    this.selectedOffers = selectedOffers;
  }

  getTemplate() {
    return createPointTemplate(this.point, this.destination, this.selectedOffers);
  }
}

