import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const DATETIME_INPUT_FORMAT = 'DD/MM/YY HH:mm';

export const toCapitalize = (string) => {
  const s = string.toLowerCase();
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
};

export const getRandomInt = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (elements) => elements[getRandomInt(0, elements.length - 1)];

export const formatDateTime = (date, format) => {
  if (!date) return '';
  return dayjs(date).format(format);
};

export const formattedDate = (date) => formatDateTime(date, DATE_FORMAT);

export const formattedTime = (date) => formatDateTime(date, TIME_FORMAT);

export const formattedDateTimeForInput = (date) => formatDateTime(date, DATETIME_INPUT_FORMAT);

export const getDuration = (dateFrom, dateTo) => {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  }
  if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};

export const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
