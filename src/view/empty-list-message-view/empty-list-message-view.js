import AbstractView from '../../framework/view/abstract-view.js';
import { createEmptyListMessageTemplate } from './empty-list-message-template.js';
import { FilterType } from '../../utils';

export default class EmptyListMessageView extends AbstractView {
  constructor(filterType = FilterType.EVERYTHING) {
    super();
    this.filterType = filterType;
  }

  get template() {
    return createEmptyListMessageTemplate(this.filterType);
  }
}
