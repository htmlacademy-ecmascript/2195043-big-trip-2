import { FilterType } from '../../utils/index.js';

const EMPTY_MESSAGES = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

export const createEmptyListMessageTemplate = (filterType = FilterType.EVERYTHING) => `
  <p class="trip-events__msg">${EMPTY_MESSAGES[filterType] || EMPTY_MESSAGES[FilterType.EVERYTHING]}</p>
`;
