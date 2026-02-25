import { adaptDestinationsToApp } from '../api/adapters.js';

export default class DestinationsModel {
  #destinations = [];
  #api = null;

  constructor(api) {
    this.#api = api;
  }

  async init() {
    try {
      const serverDestinations = await this.#api.getDestinations();
      this.#destinations = adaptDestinationsToApp(serverDestinations);
    } catch (error) {
      this.#destinations = [];
      throw error;
    }
  }

  getDestinations() {
    return [...this.#destinations];
  }

  getDestinationById(id) {
    return this.#destinations.find((dest) => dest.id === id);
  }

  getDestinationByName(name) {
    return this.#destinations.find((dest) => dest.name === name);
  }
}
