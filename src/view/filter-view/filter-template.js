import { FilterType } from '../../utils/index.js';

export const createFilterTemplate = (filterAvailability = {}, currentFilter = FilterType.EVERYTHING) => {
  const isEverythingAvailable = filterAvailability[FilterType.EVERYTHING] === true;
  const isFutureAvailable = filterAvailability[FilterType.FUTURE] === true;
  const isPastAvailable = filterAvailability[FilterType.PAST] === true;
  const isPresentAvailable = filterAvailability[FilterType.PRESENT] === true;

  const isEverythingDisabled = !isEverythingAvailable;
  const isFutureDisabled = !isFutureAvailable;
  const isPastDisabled = !isPastAvailable;
  const isPresentDisabled = !isPresentAvailable;

  return `
    <form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${isEverythingDisabled ? 'disabled' : ''} ${currentFilter === FilterType.EVERYTHING ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${isFutureDisabled ? 'disabled' : ''} ${currentFilter === FilterType.FUTURE ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-present" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="present" ${isPresentDisabled ? 'disabled' : ''} ${currentFilter === FilterType.PRESENT ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-present">Present</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${isPastDisabled ? 'disabled' : ''} ${currentFilter === FilterType.PAST ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};
