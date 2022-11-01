import Loki from '@skapoor8/loki';
import TodoListIcon from './todo-list-icon';
import VanillaContextMenu from 'vanilla-context-menu';

class TodoIndexListItem extends Loki.Component {
    static selector = 'todo-index-list-item';
    static events = ['click', 'contextmenu', 'delete'];
    static components = [
        TodoListIcon
    ];

    render() {
        return /* html */`
            <div 
              class="todoindexlistitem-container <%= isSelected ? 'todoindexlistitem-selected' : '' %>"
              (click)="onClickContainer"
              (contextmenu)="onContextContainer"
            >
              <todo-list-icon class="todoindexlistitem-icon" state="<%= {'color': color} %>"></todo-list-icon>
              <span><%= title %></span>
            </div>
        `;
    }

    static style() {
        return /* css */`
          todo-index-list-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0.10rem 0.5rem;
          }

          .todoindexlistitem-container {
            display: flex;
            flex-grow: 1;
            flex-direction: row;
            align-items: center;
            border-radius: 0.2rem;
            padding: 0.25rem 0.5rem;
            cursor: pointer;
          }

          .todoindexlistitem-container:hover {
            background: var(--gray-m);
          }

          .todoindexlistitem-container.todoindexlistitem-selected {
            background: #3285ff;
            color: white;
            font-weight: semibold;
          }

          .todoindexlistitem-icon {
            margin-right: 0.5rem;
          }
        `;
    }

    onClickContainer(e) {
      this.dispatchEvent('click', this.state);
    }

    onContextContainer(e) {
      // console.error('context:', this.state);
      // this.dispatchEvent('contextmenu', this.state);
      // e.preventDefault();
      // e.stopPropagation();

      new VanillaContextMenu({
        scope: document.querySelector('body'),
        theme: 'white',
        customClass: 'context-menu-orange-theme',
        customThemeClass: 'context-menu-orange-theme',
        menuItems: [
          {
            iconClass: 'fa-solid fa-pen',
            label: 'Edit',
            callback: () => {
              // your code here
              // console.log('edit!');
              this.dispatchEvent('contextmenu', this.state);
            },
          },
          {
            iconClass: 'fa-regular fa-trash-can',
            label: 'Delete',
            callback: () => {
              // your code here
              // console.log('delete!');
              this.dispatchEvent('delete', this.state);
            },
          },
        ]
      });
    }

    onInit() {
      // console.log('TodoListItem onInit: state =', this.state);
      
    }
}

export default TodoIndexListItem;