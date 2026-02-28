import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const DATETIME_INPUT_FORMAT = 'DD/MM/YY HH:mm';

export const toCapitalize = (string) => {
  const s = string.toLowerCase();
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
};

export const formatDateTime = (date, format) => {
  if (!date) {
    return '';
  }
  return dayjs(date).format(format);
};

export const formattedDate = (date) => formatDateTime(date, DATE_FORMAT);

export const formatDateRange = (dateFrom, dateTo) => {
  if (!dateFrom || !dateTo) {
    return '';
  }
  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);
  const firstPart = from.format('D MMM');
  const secondPart = to.format('D MMM');
  return `${firstPart}&nbsp;&mdash;&nbsp;${secondPart}`;
};

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

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export const UserAction = {
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  DELETE: 'DELETE'
};

export const isPointFuture = (point) => {
  const now = dayjs();
  return dayjs(point.date_from).isAfter(now);
};

export const isPointPast = (point) => {
  const now = dayjs();
  return dayjs(point.date_to).isBefore(now);
};

export const isPointPresent = (point) => {
  const now = dayjs();
  const dateFrom = dayjs(point.date_from);
  const dateTo = dayjs(point.date_to);
  return (dateFrom.isBefore(now) || dateFrom.isSame(now)) && (dateTo.isAfter(now) || dateTo.isSame(now));
};

const filterByType = {
  [FilterType.FUTURE]: isPointFuture,
  [FilterType.PAST]: isPointPast,
  [FilterType.PRESENT]: isPointPresent,
  [FilterType.EVERYTHING]: () => true
};

export const filterPoints = (points, filterType) => {
  const filterFn = filterByType[filterType] || filterByType[FilterType.EVERYTHING];
  return points.filter(filterFn);
};

export const getFilterAvailability = (points) => {
  const hasFuture = points.some(isPointFuture);
  const hasPast = points.some(isPointPast);
  const hasPresent = points.some(isPointPresent);

  return {
    [FilterType.EVERYTHING]: true,
    [FilterType.FUTURE]: hasFuture,
    [FilterType.PAST]: hasPast,
    [FilterType.PRESENT]: hasPresent
  };
};
