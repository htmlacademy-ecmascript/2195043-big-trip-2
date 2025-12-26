import View from '../view.js';
import { createFormEditTemplate } from './form-edit-template.js';

export default class FormEditView extends View {
  getTemplate() {
    return createFormEditTemplate();
  }
}

