import View from '../view.js';
import { createPointTemplate } from './point-template.js';

export default class PointView extends View {
  getTemplate() {
    return createPointTemplate();
  }
}

