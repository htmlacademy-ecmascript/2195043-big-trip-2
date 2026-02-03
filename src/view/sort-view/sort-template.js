export const createSortTemplate = (currentSortType = 'day') => {
  const sortTypes = [
    { type: 'day', value: 'sort-day', label: 'Day', disabled: false },
    { type: 'event', value: 'sort-event', label: 'Event', disabled: true },
    { type: 'time', value: 'sort-time', label: 'Time', disabled: false },
    { type: 'price', value: 'sort-price', label: 'Price', disabled: false },
    { type: 'offer', value: 'sort-offer', label: 'Offers', disabled: true }
  ];

  return `
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${sortTypes.map(({ type, value, label, disabled }) => `
        <div class="trip-sort__item  trip-sort__item--${type}">
          <input 
            id="${value}" 
            class="trip-sort__input  visually-hidden" 
            type="radio" 
            name="trip-sort" 
            value="${value}" 
            data-sort-type="${type}"
            ${currentSortType === type ? 'checked' : ''}
            ${disabled ? 'disabled' : ''}
          >
          <label class="trip-sort__btn" for="${value}">${label}</label>
        </div>
      `).join('')}
    </form>
  `;
};
