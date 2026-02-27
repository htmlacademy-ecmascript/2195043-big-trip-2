import TripInfoView from '../view/trip-info-view/trip-info-view.js';
import { render, RenderPosition } from '../utils/render.js';
import { FilterType, filterPoints, formatDateRange } from '../utils';

const DESTINATIONS_SEPARATOR = ' &mdash; ';
const MAX_DESTINATIONS_FULL = 3;

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #tripInfoView = null;

  constructor({ container, pointsModel, destinationsModel, filterModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
  }

  init() {
    this.update();
  }

  update() {
    const allPoints = this.#pointsModel.getPoints();
    const currentFilter = this.#filterModel?.getFilter() ?? FilterType.EVERYTHING;
    const filteredPoints = filterPoints(allPoints, currentFilter);
    const sortedPoints = [...filteredPoints].sort(
      (a, b) => new Date(a.date_from) - new Date(b.date_from)
    );

    if (this.#tripInfoView) {
      const el = this.#tripInfoView.element;
      if (el?.parentNode) {
        el.remove();
      }
      this.#tripInfoView.removeElement();
      this.#tripInfoView = null;
    }

    if (sortedPoints.length === 0 || !this.#container) {
      return;
    }

    const destinationNames = [];
    let prevDestId = null;
    for (const point of sortedPoints) {
      const dest = this.#destinationsModel.getDestinationById(point.destination);
      const name = dest?.name;
      if (name && point.destination !== prevDestId) {
        destinationNames.push(name);
        prevDestId = point.destination;
      }
    }

    const title = destinationNames.length > 0
      ? (destinationNames.length <= MAX_DESTINATIONS_FULL
        ? destinationNames.join(DESTINATIONS_SEPARATOR)
        : `${destinationNames[0]}${DESTINATIONS_SEPARATOR}...${DESTINATIONS_SEPARATOR}${destinationNames[destinationNames.length - 1]}`)
      : '';
    const dates = formatDateRange(
      sortedPoints[0].date_from,
      sortedPoints[sortedPoints.length - 1].date_to
    );
    const cost = sortedPoints.reduce((sum, p) => sum + (p.base_price || 0), 0);

    this.#tripInfoView = new TripInfoView({ title, dates, cost });
    render(this.#tripInfoView, this.#container, RenderPosition.AFTERBEGIN);
  }
}
