import View from '../view.js';
import { createSortTemplate } from './sort-template.js';

export default class SortView extends View {
  getTemplate() {
    return createSortTemplate();
  }
}
