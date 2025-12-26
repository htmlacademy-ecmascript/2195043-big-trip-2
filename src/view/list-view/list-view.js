import View from '../view.js';
import { createListTemplate } from './list-template.js';

export default class ListView extends View {
  getTemplate() {
    return createListTemplate();
  }
}

