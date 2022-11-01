import Loki from '@skapoor8/loki';

class TodoListIcon extends Loki.Component {
    static selector = 'todo-list-icon';

    render() {
        return /* html */`
          <span class="todolisticon-container <%= 'bg-'+color %>">
            <i class="todolisticon-icon fa-solid fa-list-ul"></i>
          </span>
        `;
    }

    static style() {
        return /* css */`
          {
            display: inline-block;
            height: max-content;
            width: max-content;
          }

          .todolisticon-container {
            display: inline-block;
            height: 2rem;
            width: 2rem;
            border-radius: 1rem;
          }

          .todolisticon-icon {
            margin-left: 0.55rem;
            margin-top: 0.62rem;
            font-size: 0.85rem;
            color: var(--white);
          }
        `;
    }
}

export default TodoListIcon;