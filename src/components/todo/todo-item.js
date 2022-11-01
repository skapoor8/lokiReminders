import Loki from '@skapoor8/loki';
import TodoListIcon from './todo-list-icon';

class TodoItem extends Loki.Component {
    static selector = 'todo-item';
    static components = [
        TodoListIcon
    ];

    render() {
        return /* html */`
            <div>
            </div>
        `;
    }

    static style() {
        return /* css */``;
    }
}

export default TodoItem;