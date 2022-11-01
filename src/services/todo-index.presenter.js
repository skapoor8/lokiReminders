import Loki from '@skapoor8/loki';
import { DataStore } from '../stores/data-store';
import { UIStore } from '../stores/ui-store';
import { TodoService } from './todo.service';

export class TodoIndexPresenter extends Loki.Service {
  static services = {
    uiStore: UIStore,
    dataStore: DataStore,
    todoService: TodoService
  }

  get viewModel() {
    const {uiStore} = this.services;
    return uiStore.val('listSummaries');
  }

  onLoad() {
    // console.log('TodoIndexPresenter.onLoad')
    const { dataStore, uiStore} = this.services;

    dataStore.sub('lists', lists => {
      this.buildViewModel();
    });

    uiStore.sub('selectedListId', (id) => {
      // console.error('selectedListId sub in TodoIndexPresenter', id);
      this.buildViewModel()
    });
  }

  selectList(listId) {
    const { dataStore, uiStore } = this.services;
    // console.log('select id:', listId);
    uiStore.pub('addedItemId', null);
    uiStore.pub('selectedListId', listId);
  }

  openCreateModal() {
    const { uiStore } = this.services;
    uiStore.pub('todoIndexModalState', {
      visible: true,
      title: '',
      color: 'red',
      mode: 'new'
    });
  }

  async openEditModal(listId) {
    const {uiStore, todoService } = this.services;
    const list = await todoService.getListById(listId);
    uiStore.pub('todoIndexModalState', {
      visible: true,
      editingListId: list.id,
      title: list.title,
      color: list.color,
      mode: 'edit'
    });
  }

  async deleteList(listId) {
    const {todoService, uiStore} = this.services;

    // handle selected list
    if (listId === uiStore.val('selectedListId')) {
      uiStore.pub('selectedListId', null);
    }

    // delete
    await todoService.deleteList(listId);
  }

  buildViewModel() {
    // console.error('buildViewModel')
    const { dataStore, uiStore} = this.services;
    const lists = dataStore.val('lists');
    const selectedListId = uiStore.val('selectedListId');
    const listSummaries = lists.map(l => ({
      id: l.id,
      title: l.title,
      color: l.color,
      isSelected: l.id === selectedListId,
      numItems: l.items?.length ?? 0
    }));
    // console.log('listSummaries:', listSummaries);
    uiStore.pub('listSummaries', listSummaries);
  }

  async createList(name, color) {
    const {todoService} = this.services;
    const createdId = await todoService.createList(name, color);
    this.selectList(createdId);
  }

}