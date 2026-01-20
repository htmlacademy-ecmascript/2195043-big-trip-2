import AbstractView from '../../framework/view/abstract-view.js';

export default class PointItemContainerView extends AbstractView {
  get template() {
    return '<li class="trip-events__item"></li>';
  }
}
