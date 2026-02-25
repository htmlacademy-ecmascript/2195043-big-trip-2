import MainPresenter from './presenter/main-presenter.js';
import Api from './api/api.js';

const api = new Api();
const mainPresenter = new MainPresenter(api);
mainPresenter.init().catch((error) => {
  console.error('Ошибка инициализации приложения:', error);
});
