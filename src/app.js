//@ts-check

import Loki from '@skapoor8/loki';

// components
import AppHeader from './components/app/app-header.js';
import AppPage from './components/app/app-page.js';
import UiModal from './components/ui/ui-modal.js';
import { TodoIndexPresenter } from './services/todo-index.presenter.js';
import { TodoListPresenter } from './services/todo-list.presenter.js';
import { TodoService } from './services/todo.service.js';
import { UIStore } from './stores/ui-store.js';

// styles
import './styles/styles.css';

class App extends Loki.Component {
  static selector = 'todo-app';
  static components = [
    AppHeader,
    AppPage,
  ];
  static events = [
    'click'
  ];
  static services = {
    todoService: TodoService,
    listPresenter: TodoIndexPresenter,
    indexPresenter: TodoListPresenter,
    uiStore: UIStore
  };

  subscriptions = [];

  render() {
    return /* html */`
      <!-- <app-header onclick="sayHi"></app-header> -->
      <app-page></app-page>
    `;
  }

  static style() {
    return /* css */`
      app-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 2rem;
      }

      app-page {
        display: flex;
        flex-grow: 1;
        flex-direction: row;
      }
    `; 
  }

  // lifecycle hooks -----------------------------------------------------------------------------
  onInit() {
    // console.error('App:', this);

    window.addEventListener('resize', this._handleWindowResize.bind(this))
    setTimeout(() => {
      this._handleWindowResize.bind(this)()
    }, 100);
  }

  // public API ----------------------------------------------------------------------------------
  sayHi() {
    // console.warn('HEY THERE!');
  }

  sayBye() {
    // console.warn('DASVIDANYA!');
  } 

  // event handlers ------------------------------------------------------------------------------

  _handleWindowResize(e) {
    const { uiStore } = this.services;
    // console.error('window resize:', window.innerWidth);
    if (window.innerWidth < 600) {
      uiStore.pub('isResponsive', true);
    } else {
      uiStore.pub('isResponsive', false);
    }
  }
}

export default App;