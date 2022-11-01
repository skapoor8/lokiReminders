import Loki from 'loki';

export class UIStore extends Loki.Store {

  init() {
    this.payloads = {
      isResponsive: window.innerWidth < 600,
      selectedListId: null,
      listSummaries: [],
      selectedListSummary: null,
      itemSummaries: [],
      completedItemSummaries: [],
      searchTerm: '',
      addedItemId: null,
      showComplete: false,
      updateList: null,
      todoIndexModalState: {
        visible: false,
        mode: 'new',
        title: '',
        color: 'red',
        editingListId: null
      }
    }
  }

}