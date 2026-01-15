import { mockDestinations } from '../mock/points';

export default class DestinationsModel {
  #destinations = [];

  async init() {
    try {
      this.#destinations = [...mockDestinations];
    } catch (error) {
      this.#destinations = [];
    }
  }

  getDestinations() {
    return [...this.#destinations];
  }

  getDestinationById(id) {
    return this.#destinations.find(dest => dest.id === id);
  }
}
