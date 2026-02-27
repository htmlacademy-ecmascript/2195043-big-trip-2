import { adaptOffersToApp } from '../api/adapters.js';

export default class OffersModel {
  #offers = [];
  #api = null;

  constructor(api) {
    this.#api = api;
  }

  async init() {
    try {
      const serverOffers = await this.#api.getOffers();
      this.#offers = adaptOffersToApp(serverOffers);
    } catch (error) {
      this.#offers = [];
      throw error;
    }
  }

  getOffersByType(type) {
    const offerGroup = this.#offers.find((group) => group.type === type);
    return offerGroup ? offerGroup.offers : [];
  }
}
