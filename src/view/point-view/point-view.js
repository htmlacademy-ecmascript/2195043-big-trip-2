import AbstractView from '../../framework/view/abstract-view.js';
import { createPointTemplate } from './point-template.js';

export default class PointView extends AbstractView {
  #onRollupClick = null;
  #onFavoriteClick = null;
  #handlersSet = false;

  constructor(point, destination, selectedOffers, onRollupClick, onFavoriteClick) {
    super();
    this.point = point;
    this.destination = destination;
    this.selectedOffers = selectedOffers;
    this.#onRollupClick = onRollupClick;
    this.#onFavoriteClick = onFavoriteClick;
  }

  get template() {
    return createPointTemplate(this.point, this.destination, this.selectedOffers);
  }

  get element() {
    const element = super.element;
    if (!this.#handlersSet) {
      this.#setEventHandlers(element);
      this.#handlersSet = true;
    }
    return element;
  }

  #setEventHandlers(element) {
    const rollupButton = element.querySelector('.event__rollup-btn');
    if (rollupButton) {
      rollupButton.addEventListener('click', this.#rollupClickHandler);
    }

    const favoriteButton = element.querySelector('.event__favorite-btn');
    if (favoriteButton) {
      favoriteButton.addEventListener('click', this.#favoriteClickHandler);
    }
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick?.();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick?.();
  };
}

