import Loki from 'loki';

export class DataStore extends Loki.Store { 
  init() {
    this.payloads = {
      lists: [],
      items: [],
    }
  }
}