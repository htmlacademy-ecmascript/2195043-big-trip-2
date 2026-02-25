import AbstractView from '../../framework/view/abstract-view.js';

export default class FailedLoadMessageView extends AbstractView {
  get template() {
    return '<p class="trip-events__msg">Failed to load data</p>';
  }
}
