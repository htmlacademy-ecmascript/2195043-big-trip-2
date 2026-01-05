import { getRandomPoint, mockDestinations, mockOffers } from '../mock/points';

const POINT_COUNT = 5;

export default class PointsModel {
  #points = [];
  #destinations = [];
  #offers = [];

  async init() {
    try {
      this.#points = Array.from({ length: POINT_COUNT }, getRandomPoint);
      this.#destinations = [...mockDestinations];
      this.#offers = [...mockOffers];
    } catch (error) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }
  }

  getPoints() {
    return [...this.#points];
  }

  getDestinations() {
    return [...this.#destinations];
  }

  getDestinationById(id) {
    return this.#destinations.find(dest => dest.id === id);
  }

  getOffersByType(type) {
    const offerGroup = this.#offers.find(group => group.type === type);
    return offerGroup ? offerGroup.offers : [];
  }
}
