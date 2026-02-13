import { getRandomPoint } from '../mock/points';

const POINT_COUNT = 5;

export default class PointsModel {
  #points = [];

  async init() {
    try {
      this.#points = Array.from({ length: POINT_COUNT }, getRandomPoint);
    } catch (error) {
      this.#points = [];
    }
  }

  getPoints() {
    return [...this.#points];
  }

  patchPoint(patch) {
    const index = this.#points.findIndex((point) => point.id === patch.id);
    if (index === -1) {
      return;
    }
    this.#points[index] = { ...this.#points[index], ...patch };
  }
}
