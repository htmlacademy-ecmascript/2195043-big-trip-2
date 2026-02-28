import SortView from '../view/sort-view';
import ListView from '../view/list-view';
import EmptyListMessageView from '../view/empty-list-message-view';
import PointItemContainerView from '../view/point-item-container-view';
import PointPresenter from './point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render, RenderPosition } from '../utils/render.js';
import { FilterType, filterPoints, UserAction } from '../utils';

const UI_BLOCKER_LOWER_LIMIT = 0;
const UI_BLOCKER_UPPER_LIMIT = 300;

export default class BoardPresenter {
  #sortComponent = null;
  #listComponent = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  #newEventButton = null;
  #onResetFilter = null;
  #onPointsChange = null;
  #pointPresenters = new Map();
  #currentSortType = 'day';
  #addFormPresenter = null;
  #addFormContainerView = null;
  #uiBlocker = null;

  constructor({ container, pointsModel, destinationsModel, offersModel, filterModel, newEventButton, onResetFilter, onPointsChange }) {
    this.container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#newEventButton = newEventButton;
    this.#onResetFilter = onResetFilter;
    this.#onPointsChange = onPointsChange;
    this.#uiBlocker = new UiBlocker({ lowerLimit: UI_BLOCKER_LOWER_LIMIT, upperLimit: UI_BLOCKER_UPPER_LIMIT });
  }

  #renderBoard() {
    const allPoints = this.#pointsModel.getPoints();
    const currentFilter = this.#filterModel?.getFilter() ?? FilterType.EVERYTHING;
    const filteredPoints = filterPoints(allPoints, currentFilter);
    const sortedPoints = this.#sortPoints(filteredPoints);

    if (sortedPoints.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderPointsList(sortedPoints);
    }
  }

  #renderEmptyList() {
    this.#clearPoints();
    this.#clearComponents();

    const currentFilter = this.#filterModel?.getFilter() ?? FilterType.EVERYTHING;
    const emptyListComponent = new EmptyListMessageView(currentFilter);
    render(emptyListComponent, this.container);
  }

  setFilter() {
    this.#currentSortType = 'day';
    if (this.#sortComponent) {
      this.#sortComponent.updateElement({ currentSortType: 'day' });
    }
    this.#renderBoard();
  }

  #renderPointsList(points) {
    this.#clearPoints();

    if (!this.#sortComponent) {
      while (this.container.firstChild) {
        this.container.firstChild.remove();
      }
    }
    if (!this.#sortComponent) {
      this.#sortComponent = new SortView(
        this.#currentSortType,
        (sortType) => this.#handleSortTypeChange(sortType)
      );
      render(this.#sortComponent, this.container, RenderPosition.AFTERBEGIN);
    }

    if (!this.#listComponent) {
      this.#listComponent = new ListView();
      render(this.#listComponent, this.container);
    }

    this.#clearListOnly();
    this.#renderPoints(points);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #clearComponents() {
    if (this.#sortComponent) {
      this.#sortComponent.removeElement();
      this.#sortComponent = null;
    }
    if (this.#listComponent) {
      this.#listComponent.removeElement();
      this.#listComponent = null;
    }

    while (this.container.firstChild) {
      this.container.firstChild.remove();
    }
  }

  #clearListOnly() {
    if (this.#listComponent && this.#listComponent.element) {
      this.#listComponent.element.innerHTML = '';
    }
  }

  #getPointData(point) {
    const destination = this.#destinationsModel.getDestinationById(point.destination);
    const availableOffers = this.#offersModel.getOffersByType(point.type);
    const selectedOffers = availableOffers.filter((offer) =>
      point.offers.includes(offer.id)
    );

    return { destination, availableOffers, selectedOffers };
  }

  #renderPoints(points) {
    points.forEach((point) => {
      const { destination, selectedOffers } = this.#getPointData(point);

      const pointItemContainerView = new PointItemContainerView();
      render(pointItemContainerView, this.#listComponent.element);

      const pointPresenter = new PointPresenter({
        container: pointItemContainerView.element,
        point,
        destination,
        selectedOffers,
        destinationsModel: this.#destinationsModel,
        offersModel: this.#offersModel,
        onDataChange: (update) => this.#handlePointChange(point.id, update),
        onModeChange: (currentPresenter) => this.#handleModeChange(currentPresenter)
      });

      this.#pointPresenters.set(point.id, pointPresenter);
      pointPresenter.init();
    });
  }

  async #handlePointChange(pointId, action) {
    const presenter = this.#pointPresenters.get(pointId);

    switch (action?.type) {
      case UserAction.DELETE:
        presenter?.setFormState({ isDeleting: true });
        this.#uiBlocker.block();
        try {
          await this.#pointsModel.deletePointOnServer(pointId);
          this.#pointPresenters.get(pointId)?.destroy();
          this.#pointPresenters.delete(pointId);
          this.#onPointsChange?.();
          this.#clearListOnly();
          this.#renderBoard();
        } catch {
          presenter?.setFormState({ isDeleting: false });
          presenter?.shakeForm();
        } finally {
          this.#uiBlocker.unblock();
        }
        break;
      default: {
        const patch = action?.type === UserAction.UPDATE ? action.payload : action;
        if (!patch) {
          return;
        }
        presenter?.setFormState({ isSaving: true });
        this.#uiBlocker.block();
        try {
          await this.#pointsModel.updatePointOnServer(pointId, patch);
          this.#onPointsChange?.();
          const point = this.#pointsModel.getPoints().find((p) => p.id === pointId);
          if (point) {
            const currentPresenter = this.#pointPresenters.get(pointId);
            if (currentPresenter) {
              const { destination, selectedOffers } = this.#getPointData(point);
              currentPresenter.updatePoint(point, destination, selectedOffers);
            }
          }
          presenter?.setFormState({ isSaving: false });
          presenter?.resetView();
        } catch {
          presenter?.setFormState({ isSaving: false });
          presenter?.shakeForm();
        } finally {
          this.#uiBlocker.unblock();
        }
      }
    }
  }

  #handleModeChange(currentPresenter) {
    if (this.#addFormPresenter) {
      this.#handleAddFormClose();
    }
    this.#resetAllPointsToViewMode(currentPresenter);
  }

  #resetAllPointsToViewMode(currentPresenter) {
    this.#pointPresenters.forEach((presenter) => {
      if (presenter !== currentPresenter) {
        presenter.resetView();
      }
    });
  }

  #handleSortTypeChange(sortType) {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    const currentFilter = this.#filterModel?.getFilter() ?? FilterType.EVERYTHING;
    const allPoints = this.#pointsModel.getPoints();
    const filteredPoints = filterPoints(allPoints, currentFilter);
    const sortedPoints = this.#sortPoints(filteredPoints);

    this.#clearPoints();
    this.#clearListOnly();
    this.#renderPoints(sortedPoints);
  }

  #sortPoints(points) {
    const sortedPoints = [...points];

    switch (this.#currentSortType) {
      case 'day':
        sortedPoints.sort((a, b) => {
          const dateA = new Date(a.date_from);
          const dateB = new Date(b.date_from);
          return dateA - dateB;
        });
        break;
      case 'time':
        sortedPoints.sort((a, b) => {
          const durationA = new Date(a.date_to) - new Date(a.date_from);
          const durationB = new Date(b.date_to) - new Date(b.date_from);
          return durationB - durationA;
        });
        break;
      case 'price':
        sortedPoints.sort((a, b) => b.base_price - a.base_price);
        break;
      default:
        break;
    }

    return sortedPoints;
  }

  init() {
    this.#renderBoard();
    this.#setNewEventButtonHandler();
  }

  #setNewEventButtonHandler() {
    this.#newEventButton?.addEventListener('click', this.#newEventClickHandler);
  }

  #newEventClickHandler = () => {
    this.#onResetFilter?.();
    this.#filterModel?.setFilter(FilterType.EVERYTHING);
    this.#currentSortType = 'day';
    this.#sortComponent?.updateElement({ currentSortType: 'day' });
    this.#closeAllForms();
    this.#renderAddForm();
  };

  #closeAllForms() {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  }

  #renderAddForm() {
    if (this.#addFormPresenter) {
      return;
    }

    let listEl = this.container.querySelector('.trip-events__list');
    if (!listEl) {
      this.#clearComponents();
      this.#sortComponent = new SortView(this.#currentSortType, (t) => this.#handleSortTypeChange(t));
      render(this.#sortComponent, this.container);
      this.#listComponent = new ListView();
      render(this.#listComponent, this.container);
      listEl = this.#listComponent.element;
    }

    this.#addFormContainerView = new PointItemContainerView();
    render(this.#addFormContainerView, listEl, RenderPosition.AFTERBEGIN);

    const defaultPoint = {
      type: 'flight',
      date_from: null,
      date_to: null,
      base_price: 0,
      offers: []
    };

    this.#addFormPresenter = new PointPresenter({
      container: this.#addFormContainerView.element,
      point: defaultPoint,
      destination: null,
      selectedOffers: [],
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: (action) => this.#handleAddFormSubmit(action),
      onModeChange: () => {},
      onAddFormClose: () => this.#handleAddFormClose(),
      isAddMode: true
    });
    this.#addFormPresenter.initAddForm();
    this.#newEventButton.disabled = true;
  }

  async #handleAddFormSubmit(action) {
    if (action?.type !== UserAction.ADD || !action.payload) {
      return;
    }

    this.#addFormPresenter?.setFormState({ isSaving: true });
    this.#uiBlocker.block();

    try {
      const data = { ...action.payload, is_favorite: false };
      const newPoint = await this.#pointsModel.createPointOnServer(data);
      const sorted = this.#sortPoints(this.#pointsModel.getPoints());
      this.#pointsModel.setPoints(sorted);
      this.#onPointsChange?.();
      this.#handleAddFormClose();
      this.#renderBoard();
    } catch {
      this.#addFormPresenter?.setFormState({ isSaving: false });
      this.#addFormPresenter?.shakeForm();
    } finally {
      this.#uiBlocker.unblock();
    }
  }

  #handleAddFormClose() {
    this.#addFormPresenter?.destroy();
    this.#addFormPresenter = null;
    this.#addFormContainerView?.element?.remove();
    this.#addFormContainerView = null;
    this.#newEventButton.disabled = false;
  }

  destroy() {
    this.#newEventButton?.removeEventListener('click', this.#newEventClickHandler);
    this.#clearPoints();
    this.#clearComponents();
  }
}
