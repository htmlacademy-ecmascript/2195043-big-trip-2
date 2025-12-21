import AbstractView from './abstract-view.js';

function createListTemplate() {
  return `
    <ul class="trip-events__list"></ul>
  `;
}

export default class ListView extends AbstractView {
  getTemplate() {
    return createListTemplate();
  }
}

