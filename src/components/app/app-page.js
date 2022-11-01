import Loki from '@skapoor8/loki';
import { DataStore } from '../../stores/data-store';
import AppSearch from './app-search';
import TodoIndex from '../todo/todo-index';
import TodoList from '../todo/todo-list';
import { TodoService } from '../../services/todo.service';
import { UIStore } from '../../stores/ui-store';
import UiModal from '../ui/ui-modal';
import TodoIndexModal from '../todo/todo-index-modal';

class AppPage extends Loki.Component {
  static selector = 'app-page';
  static components = [
    AppSearch,
    TodoIndex, 
    TodoList,
    TodoIndexModal
  ];
  static services = {
    dataStore: DataStore,
    uiStore: UIStore,
    todoService: TodoService,
  };

  render() {
    return /* html */`
      <% if ((isResponsive && !selectedId) || !isResponsive) { %>
        <div class="apppage-columnleft surface-a <%= isResponsive ? 'apppage-columnleft-responsive' : '' %>">
          <% if (!isResponsive) { %>
            <app-search (change)="onSearch"></app-search>
          <% } %>
          <todo-index el="index"></todo-index>
          <div class="apppage-columnleft-addlistbutton"
            (click)="showCreateModal"
          >
            <i class="fa-solid fa-circle-plus"></i>
            <span >Add List</span>
          </div>
        </div>
      <% } %>
      <% if (selectedId) { %>
        <div class="apppage-columnright">
          <% if (isResponsive) { %>
            <div class="apppage-columnright-responsivenav">
              <span 
                class="fas fa-angle-left apppage-columngright-back-button"
                (click)="onClickBack"  
              ></span>
              <app-search class="apppage-columnright-responsivenav-search" (change)="onSearch"></app-search>
            </div>
          <% } %>
        
          <todo-list el="list"></todo-list>
        </div>
      <% } %>  
      <todo-index-modal el="modal"></todo-index-modal>
    `;
  }

  static style() {
      return /* css */`
        app-page {
          display: block;
          width: 100%;
        }

        .apppage-columnleft {
          display: flex;
          flex-direction: column;
          flex-basis: 20%;
        }

        .apppage-columnleft.apppage-columnleft-responsive {
          flex-basis: 100%;
        }

        .apppage-columnleft todo-index {
          flex-grow: 1;
        }
        

        .apppage-columnleft-addlistbutton {
          padding: 0.5rem;
          border-top: thin solid var(--gray-m);
          color: var(--gray-d);
          cursor: pointer;
        }

        .apppage-columnright {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          flex-basis: 80%;
          // max-width: 80vw;
          min-width: 1px;
        }

        .apppage-columnright .apppage-columnright-responsivenav {
          display: flex;
          flex-direction: row;
          gap: 0.5rem;
          align-items: center;
          padding: 1rem;
        }

        .apppage-columnright .apppage-columnright-responsivenav .apppage-columnright-responsivenav-search {
          flex-grow: 1;
        }

        .apppage-columnright .apppage-columnright-responsivenav .apppage-columnright-responsivenav-search .appsearch-container {
          background: #f3f3f3;
          margin: 0;
          border: none;
        }

        .apppage-columnright .apppage-columnright-responsivenav .apppage-columngright-back-button {
          padding: 0.5rem 0.7rem;
          border-radius: 1rem;
        }

        .apppage-columnright .apppage-columnright-responsivenav .apppage-columngright-back-button:hover {
          background: var(--gray-l)
        }
      `;
  }

  // lifecycle hooks -----------------------------------------------------------------------------

 
  onBeforeInit() {
    const { uiStore } = this.services;
    this.state = {
      ...this.state,
      isResponsive: uiStore.val('isResponsive'),
      selectedId: uiStore.val('selectedListId'),
      showIndex: true
    };
  }

  onInit() {
    const { uiStore } = this.services;

    // this.state = {
    //   ...this.state,
    //   isResponsive: uiStore.val('isResponsive'),
    //   selectedId: uiStore.val('selectedListId')
    // }
    
    // console.log('AppPage: this =', this);
    this.subscriptions = [];
    this.subscriptions.push(
      uiStore.sub('selectedListId', id => this.setState({selectedId: id})),
    );

    // subs firing at the same time is causing a conflict here
    setTimeout(
      () => {
        this.subscriptions.push(uiStore.sub('isResponsive', isResponsive => {
          // console.log(this.uid, '-','isResponsive:', isResponsive, 'selectedId', this.state.selectedId, this);
          this.setState({isResponsive})
        }))
      },
      300
    )
    // this.services.todoService.exampleServiceMethod();
  }

  onDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  // api

  showCreateModal() {
    this.elements['modal']?.show();
  } 

  onSearch(changeEvent) {
    const {uiStore} = this.services;
    const query = changeEvent.detail.data;
    // console.log('AppPage: searched ', query);
    uiStore.pub('searchTerm', query ?? '');
  }

  onClickBack() {
    const {uiStore} = this.services;
    uiStore.pub('selectedListId', null);
  }
}

export default AppPage;