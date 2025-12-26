import View from '../view.js';
import { createFilterTemplate } from './filter-template.js';

export default class FilterView extends View {
  getTemplate() {
    return createFilterTemplate();
  }
}

