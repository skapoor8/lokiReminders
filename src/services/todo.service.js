import Dexie from 'dexie';
import Loki from 'loki';
import { DataStore } from '../stores/data-store';
import { UIStore } from '../stores/ui-store';

export class TodoService extends Loki.Service {

  static services = {
    dataStore: DataStore
  };

  async onLoad() {
    // console.error('TodoService.onLoad');
    this.db = new Dexie('LokiRemindersData');
    this._initSchema();
    await this._loadFromIndexedDB();
  }

  onUnload() {
    // console.error('TodoService.onUnload');
  }

  exampleServiceMethod() {
    // console.error('Called exampleServiceMethod!');
  }

  async getListById(id) {
    return await this.db.TodoLists.get({id});
  }

  /**
   * Gets lists from indexed db, and publishes them to the
   * lists property on the data store
   */
  async getLists() {
    let lists = await this.db.TodoLists.toArray();
    this.services.dataStore.pub('lists', lists);
  }

  /**
   * Adds a new list and updates the lists property in the
   * data store
   * @param {} title 
   * @param {*} color 
   */
  async createList(title, color) {
    const createdId = await this.db.TodoLists.add({
      documentType: 'TodoList',
      title,
      color,
      items: []
    });
    await this.getLists();
    return createdId;
  }

  async deleteList(id) {
    await this.db.TodoLists.delete(id);
    await this.getLists();
  }

  async updateList(id, newTitle, newColor) {
    await this.db.TodoLists.put({
      id: id, 
      title: newTitle,
      color: newColor
    });
    await this.getLists();
  }

  async getTodoItemsByListId(id) {
    const list = await this.db.TodoLists.get({id});
    const listItemIds = list.items;
    await this.getTodoItems(listItemIds);
  }

  async getTodoItems(ids) {
    if (ids?.length > 0) {
      const items = await this.db.TodoItems.bulkGet(ids);
      this.services.dataStore.pub('items', items);
    } else {
      this.services.dataStore.pub('items', []);
    }
  }

  async createTodoItem(listId, title, insertAt = -1) {
    // console.log('insertAt:', insertAt);
    const list = await this.db.TodoLists.get({id: listId});

    // add todo item
    const itemId = await this.db.TodoItems.add({
      documentType: 'TodoItem',
      title,
      done: false,
      doneAt: null,
    });
    // console.log('item added:', itemId);
    
    // add item to list
    if (!list.items?.includes(itemId)) {
      if (insertAt >= -1 && insertAt < list.items.length) {
        list.items.splice(insertAt, 0, itemId);
      } else {
        list.items.push(itemId);
      }
    }

    // update item
    await this.db.TodoLists.put(list);

    // update item and list
    await Promise.all([
      this.getTodoItemsByListId(listId),
      this.getLists()
    ]);

    return itemId;
  }

  async updateTodoItem(id, args) {
    const toUpdate = await this.db.TodoItems.get({id});
    if (!toUpdate) throw new Error(`Updating non-existent TodoItem with id ${id}`);
    if (args.title) toUpdate.title = args.title;
    if (args.done !== undefined) {
      toUpdate.done = args.done;
      if (args.done) {
        toUpdate.doneAt = Date.now();
      } else {
        toUpdate.doneAt = null;
      }
    }
    // console.log('TodoService.updateTodoItem:', args);
    await this.db.TodoItems.put(toUpdate)
  }

  async deleteTodoItem(listId, itemId) {
    const toDel = await this.db.TodoItems.get({id: itemId});
    const list = await this.db.TodoLists.get({id: listId});
    if (!toDel) throw new Error(`Deleting non-existent TodoItem with id ${itemId}`);

    // console.log('deleting item', toDel, 'from list', list);

    // delete list item
    await this.db.TodoItems.delete(itemId);

    // remove list item from list
    const foundAt = list.items.indexOf(itemId);
    list.items.splice(foundAt, 1);
    await this.db.TodoLists.put(list);

    // update list and list items in data store
    await this.getTodoItemsByListId(listId);
    await this.getLists();
  }

  async deleteTodoItems(listId, itemIds) {
    const toDel = await this.db.TodoItems.bulkGet(itemIds);
    const list = await this.db.TodoLists.get({id: listId});
    if (!toDel || toDel.length === 0) throw new Error(`Deleting non-existent TodoItems with ids ${JSON.stringify(itemIds)}`);

    // console.log('deleting items', toDel, 'from list', list);

    // delete list item
    await this.db.TodoItems.bulkDelete(itemIds);

    // remove list items from list
    itemIds.forEach(itemId => {
      const foundAt = list.items.indexOf(itemId);
      list.items.splice(foundAt, 1);
    })
    await this.db.TodoLists.put(list);

    // update list and list items in data store
    await this.getTodoItemsByListId(listId);
    await this.getLists();
  }

  // helpers

  _initSchema() {
    this.db.version(1).stores({
      TodoLists: '++id, documentType, title, color, *items',
      TodoItems: '++id, documentType, title, done'
    });

    this.db.version(2).stores({
      TodoLists: '++id, documentType, title, color, *items',
      TodoItems: '++id, documentType, title, done, doneAt'
    });
  }

  async _loadFromIndexedDB() {
    const {dataStore} = this.services;
    let lists = await this.db.TodoLists.toArray();
    // console.log('lists initial:', lists);

    if (lists?.length === 0) {
      await this.db.TodoLists.bulkAdd([
        {
          documentType: 'TodoList',
          title: 'Today',
          color: 'green',
          items: []
        },
        {
          documentType: 'TodoList',
          title: 'Work',
          color: 'blue',
          items: []
        },
        {
          documentType: 'TodoList',
          title: 'Reminders',
          color: 'red',
          items: []
        }
      ]);
    }


    lists = await this.db.TodoLists.toArray();
    // console.log('lists final:', lists);

    dataStore.pub('lists', lists);

  }

  _saveToIndexedDB() {

  }
}