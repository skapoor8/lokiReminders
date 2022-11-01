import Loki from '@skapoor8/loki';
import { DataStore } from '../stores/data-store';
import { UIStore } from '../stores/ui-store';
import { TodoService } from './todo.service';

export class TodoListPresenter extends Loki.Service {
  static services = {
    dataStore: DataStore,
    uiStore: UIStore,
    todoService: TodoService
  };
  subscriptions = [];

  // build view model

  _buildViewModel() {
    const { dataStore, uiStore, todoService } = this.services;
    const listId = uiStore.val('selectedListId');
    const listSummary = this.getListSummary();
    let doneCount = 0;

    const items = dataStore.val('items');
    const searchTerm = uiStore.val('searchTerm');
    const itemSummaries = [];
    const completedSummaries = []
    
    items.forEach(item => {
      if (item.done) doneCount++;
      const doneAgo = Date.now() - (item.doneAt ?? 0)
      
      const summary = {
        id: item.id,
        title: item.title,
        done: item.done
      };
      if (
        (!item.done || (item.done && doneAgo <= 5000))
        && item.title.includes(searchTerm)
      ) {
        itemSummaries.push(summary);
      } else if (item.title.includes(searchTerm)) {
        completedSummaries.push(summary);
      }
      
    });

    listSummary.completed = doneCount;

    // console.log('items:', itemSummaries, 'complete:', completedSummaries)

    uiStore.pub('selectedListSummary', listSummary);
    uiStore.pub('itemSummaries', itemSummaries);
    uiStore.pub('completedItemSummaries', completedSummaries);
  }

  // lifecycle 

  onLoad() {
    const { dataStore, uiStore } = this.services;
    this.subscriptions.push(
      uiStore.sub('selectedListId', async sel => await this._handleListSelection(sel)),
      dataStore.sub('items', () => this._buildViewModel()),
      uiStore.sub('updateList', () => this._buildViewModel()),
      uiStore.sub('searchTerm', () => this._buildViewModel())
    );
  }

  onUnload() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // api  

  refresh() {
    this._buildViewModel();
  }

  getListSummary() {
    const { uiStore } = this.services;
    const selId = uiStore.val('selectedListId');
    const summaries = uiStore.val('listSummaries');
    const selected = summaries.find(s => s.id == selId);
    return selected;
  }

  async addTodoItem(insertAfterId = -1) {
    // console.log('insertAfterId:', insertAfterId)
    const {todoService, uiStore} = this.services;
    const listId = uiStore.val('selectedListId');

    let index = -1;
    if (insertAfterId > 0) {
      const list = await todoService.getListById(listId);
      index = list.items.indexOf(insertAfterId) + 1;
    }

    const addedItemId = await todoService.createTodoItem(listId, '', index);
    setTimeout(() => 
      uiStore.pub('addedItemId', addedItemId),
      50
    );
  }

  async updateTodoItem(id, args={}) {
    const {todoService, uiStore } = this.services;
    await todoService.updateTodoItem(id, args); 
    await todoService.getTodoItemsByListId(uiStore.val('selectedListId'))
    if (args.done) {
      setTimeout(() => uiStore.pub('updateList', null), 5002);
    }
  }

  async deleteTodoItem(itemId) {
    const {todoService, uiStore} = this.services;
    const listId = uiStore.val('selectedListId');
    await todoService.deleteTodoItem(listId, itemId);
  }

  toggleShowComplete() {
    const { uiStore } = this.services;
    uiStore.pub('showComplete', !uiStore.val('showComplete'));
  }

  async deleteCompletedItems() {
    const { uiStore, todoService } = this.services;

    const listId = uiStore.val('selectedListId');
    const completedItems = uiStore.val('completedItemSummaries') ?? [];
    const completedItemIds = completedItems.map(item => item.id);

    await todoService.deleteTodoItems(listId, completedItemIds);
  }

  // subscription handlers
  async _handleListSelection(selectedListId) {
    if (selectedListId) await this.services.todoService.getTodoItemsByListId(selectedListId);
  }


  // helpers
}