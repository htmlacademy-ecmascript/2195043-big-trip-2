import AbstractView from '../../framework/view/abstract-view.js';
import { createPointTemplate } from './point-template.js';

export default class PointView extends AbstractView {
  #onRollupClick = null;
  #handlersSet = false;

  constructor(point, destination, selectedOffers, onRollupClick) {
    super();
    this.point = point;
    this.destination = destination;
    this.selectedOffers = selectedOffers;
    this.#onRollupClick = onRollupClick;
  }

  get template() {
    return createPointTemplate(this.point, this.destination, this.selectedOffers);
  }

  get element() {
    const element = super.element;
    if (!this.#handlersSet) {
      this.#setRollupClickHandler(element);
      this.#handlersSet = true;
    }
    return element;
  }

  #setRollupClickHandler(element) {
    const rollupButton = element.querySelector('.event__rollup-btn');
    if (rollupButton) {
      rollupButton.addEventListener('click', this.#rollupClickHandler);
    }
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick?.();
  };
}

