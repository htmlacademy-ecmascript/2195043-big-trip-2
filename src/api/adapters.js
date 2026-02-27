const adaptPointToApp = (serverPoint) => ({
  id: serverPoint.id,
  base_price: serverPoint.base_price,
  date_from: serverPoint.date_from,
  date_to: serverPoint.date_to,
  destination: serverPoint.destination,
  is_favorite: serverPoint.is_favorite,
  offers: Array.isArray(serverPoint.offers) ? [...serverPoint.offers] : [],
  type: serverPoint.type
});

export const adaptPointsToApp = (serverPoints) =>
  (serverPoints || []).map(adaptPointToApp);

export const adaptDestinationsToApp = (serverDestinations) =>
  (serverDestinations || []).map((dest) => ({
    id: dest.id,
    description: dest.description,
    name: dest.name,
    pictures: Array.isArray(dest.pictures) ? [...dest.pictures] : []
  }));

export const adaptOffersToApp = (serverOffers) =>
  (serverOffers || []).map((group) => ({
    type: group.type,
    offers: (group.offers || []).map((offer) => ({
      id: offer.id,
      title: offer.title,
      price: offer.price
    }))
  }));

export const adaptPointToServer = (appPoint) => ({
  id: appPoint.id,
  base_price: appPoint.base_price,
  date_from: appPoint.date_from,
  date_to: appPoint.date_to,
  destination: appPoint.destination,
  is_favorite: appPoint.is_favorite,
  offers: Array.isArray(appPoint.offers) ? [...appPoint.offers] : [],
  type: appPoint.type
});

export const adaptPointToServerForCreate = (appPoint) => ({
  base_price: appPoint.base_price,
  date_from: appPoint.date_from,
  date_to: appPoint.date_to,
  destination: appPoint.destination,
  is_favorite: appPoint.is_favorite ?? false,
  offers: Array.isArray(appPoint.offers) ? [...appPoint.offers] : [],
  type: appPoint.type
});
