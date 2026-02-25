import AbstractView from '../../framework/view/abstract-view.js';

export default class LoadingMessageView extends AbstractView {
  get template() {
    return '<p class="trip-events__msg">Loading...</p>';
  }
}
