import { getRandomArrayElement, getRandomInt, POINT_TYPES } from '../utils';

export const mockDescription = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
];

export const mockDestinations = [
  {
    id: 'dest-1',
    description: getRandomArrayElement(mockDescription),
    name: 'Chamonix',
    pictures: Array.from({length: 4}, (_, i) => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInt(1, 1000)}`,
      description: 'Chamonix parliament building'
    }))
  },
  {
    id: 'dest-2',
    description: getRandomArrayElement(mockDescription),
    name: 'Geneva',
    pictures: Array.from({length: 4}, (_, i) => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInt(1, 1000)}`,
      description: 'Geneva parliament building'
    }))
  },
  {
    id: 'dest-3',
    description: getRandomArrayElement(mockDescription),
    name: 'Amsterdam',
    pictures: Array.from({length: 4}, (_, i) => ({
      src: `https://loremflickr.com/248/152?random=${getRandomInt(1, 1000)}`,
      description: 'Amsterdam parliament building'
    }))
  },
];

export const mockOffers = [
  {
    type: 'taxi',
    offers: [
      { id: 'taxi-offer-1', title: 'Upgrade to a business class', price: 120 },
      { id: 'taxi-offer-2', title: 'Order Uber', price: 20 },
      { id: 'taxi-offer-3', title: 'Add luggage', price: 50 }
    ]
  },
  {
    type: 'bus',
    offers: [
      { id: 'bus-offer-1', title: 'Choose seats', price: 5 },
      { id: 'bus-offer-2', title: 'Add meal', price: 15 },
      { id: 'bus-offer-3', title: 'Travel by train', price: 40 }
    ]
  },
  {
    type: 'train',
    offers: [
      { id: 'train-offer-1', title: 'Choose seats', price: 5 },
      { id: 'train-offer-2', title: 'Add meal', price: 15 },
      { id: 'train-offer-3', title: 'Switch to comfort', price: 80 }
    ]
  },
  {
    type: 'ship',
    offers: [
      { id: 'ship-offer-1', title: 'Choose seats', price: 10 },
      { id: 'ship-offer-2', title: 'Add meal', price: 20 },
      { id: 'ship-offer-3', title: 'Switch to comfort', price: 100 }
    ]
  },
  {
    type: 'drive',
    offers: [
      { id: 'drive-offer-1', title: 'Add luggage', price: 30 },
      { id: 'drive-offer-2', title: 'Rent a car', price: 200 },
      { id: 'drive-offer-3', title: 'Add meal', price: 15 }
    ]
  },
  {
    type: 'flight',
    offers: [
      { id: 'flight-offer-1', title: 'Choose seats', price: 20 },
      { id: 'flight-offer-2', title: 'Add meal', price: 15 },
      { id: 'flight-offer-3', title: 'Add luggage', price: 50 },
      { id: 'flight-offer-4', title: 'Switch to comfort', price: 80 }
    ]
  },
  {
    type: 'check-in',
    offers: [
      { id: 'check-in-offer-1', title: 'Add breakfast', price: 25 },
      { id: 'check-in-offer-2', title: 'Late check-in', price: 10 },
      { id: 'check-in-offer-3', title: 'Add luggage', price: 30 }
    ]
  },
  {
    type: 'sightseeing',
    offers: [
      { id: 'sightseeing-offer-1', title: 'Book tickets', price: 40 },
      { id: 'sightseeing-offer-2', title: 'Lunch in city', price: 30 },
      { id: 'sightseeing-offer-3', title: 'Add meal', price: 15 }
    ]
  },
  {
    type: 'restaurant',
    offers: [
      { id: 'restaurant-offer-1', title: 'Add meal', price: 15 },
      { id: 'restaurant-offer-2', title: 'Choose seats', price: 5 },
      { id: 'restaurant-offer-3', title: 'Order Uber', price: 20 }
    ]
  }
];

const getOffersByType = (type) => {
  const offerGroup = mockOffers.find(group => group.type === type);
  return offerGroup ? offerGroup.offers : [];
};

export const getRandomPoint = () => {
  const type = getRandomArrayElement(POINT_TYPES);
  const availableOffers = getOffersByType(type);
  const selectedOffers = availableOffers.length > 0 
    ? [getRandomArrayElement(availableOffers).id]
    : [];
  
  const now = new Date();
  const dateFrom = new Date(now.getTime() + getRandomInt(-30, 30) * 24 * 60 * 60 * 1000);
  const daysToAdd = getRandomInt(1, 7);
  const hoursToAdd = getRandomInt(1, 12);
  const dateTo = new Date(dateFrom.getTime() + daysToAdd * 24 * 60 * 60 * 1000 + hoursToAdd * 60 * 60 * 1000);

  return {
    id: crypto.randomUUID(),
    base_price: getRandomInt(100, 1500),
    date_from: dateFrom.toISOString(),
    date_to: dateTo.toISOString(),
    destination: getRandomArrayElement(mockDestinations).id,
    is_favorite: Boolean(getRandomInt(0, 1)),
    offers: selectedOffers,
    type: type
  };
};
