import Loki from '@skapoor8/loki';

class AppHeader extends Loki.Component {
  static selector = 'app-header';

  render() {
    return /* html */`
      <span class="appheader-title">LokiTodo</span>
      <div class="appheader-searchcontainer">
        <input type="search" placeholder="Search"/>
      </div>
      <div class="appheader-actions">
        <span>Light/Dark</span>
        <button>Add</button>
      </div>
    `;
  }

  static style() {
    return /* css */`
      .appheader-title {
        flex-basis: 20%;
      }

      .appheader-searchcontainer {
        flex-grow: 1;
      }

      .appheader-actions {
        flex-basis: 20%;
      }
    
    `;
  }
}

export default AppHeader;