import MainPresenter from './presenter/main-presenter.js';

const mainPresenter = new MainPresenter();
mainPresenter.init().catch((error) => {
  console.error('Ошибка инициализации приложения:', error);
});
