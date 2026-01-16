import { mockOffers } from '../mock/points';

export default class OffersModel {
  #offers = [];

  async init() {
    try {
      this.#offers = [...mockOffers];
    } catch (error) {
      this.#offers = [];
    }
  }

  getOffersByType(type) {
    const offerGroup = this.#offers.find(group => group.type === type);
    return offerGroup ? offerGroup.offers : [];
  }
}
