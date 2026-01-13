import { createElement } from '../utils/render.js';

export default class View {
  #element = null;

  getTemplate() {
    throw new Error('Абстрактный метод getTemplate() должен быть реализован в дочернем классе');
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

