import { adaptPointsToApp, adaptPointToServer, adaptPointToServerForCreate } from '../api/adapters.js';

export default class PointsModel {
  #points = [];
  #api = null;

  constructor(api) {
    this.#api = api;
  }

  async init() {
    try {
      const serverPoints = await this.#api.getPoints();
      this.#points = adaptPointsToApp(serverPoints);
    } catch (error) {
      this.#points = [];
      throw error;
    }
  }

  getPoints() {
    return [...this.#points];
  }

  setPoints(points) {
    this.#points = [...points];
  }

  async updatePointOnServer(pointId, patch) {
    const index = this.#points.findIndex((point) => point.id === pointId);
    if (index === -1) {
      throw new Error(`Point ${pointId} not found`);
    }
    const updatedPoint = { ...this.#points[index], ...patch };
    const serverData = adaptPointToServer(updatedPoint);
    const serverPoint = await this.#api.updatePoint(pointId, serverData);
    const adapted = adaptPointsToApp([serverPoint])[0];
    this.#points[index] = adapted;
    return adapted;
  }

  async createPointOnServer(data) {
    const serverData = adaptPointToServerForCreate(data);
    const serverPoint = await this.#api.createPoint(serverData);
    const adapted = adaptPointsToApp([serverPoint])[0];
    this.#points.push(adapted);
    return adapted;
  }

  async deletePointOnServer(pointId) {
    await this.#api.deletePoint(pointId);
    this.#points = this.#points.filter((point) => point.id !== pointId);
  }
}
