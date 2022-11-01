import Loki from '@skapoor8/loki';
import { TodoListPresenter } from '../../services/todo-list.presenter';
import { UIStore } from '../../stores/ui-store';
import UiCircleCheckbox from '../ui/ui-circle-checkbox';

class TodoList extends Loki.Component {
    static selector = 'todo-list';
    static components = [
        UiCircleCheckbox
    ];
    static events = ['click'];
    static services = {
        uiStore: UIStore,
        presenter: TodoListPresenter
    };
    subscriptions = [];

    render() {
        const { presenter, uiStore } = this.services;

        this.state = {
            summary: presenter.getListSummary(),
            items: uiStore.val('itemSummaries') ?? [],
            completed: uiStore.val('completedItemSummaries'),
            showComplete: uiStore.val('showComplete')
        }
        return /* html */`
            
            <div class="todolist-summary">
                <h2 class="todolist-header <%= 'text-'+summary?.color %>"><%= summary?.title %></h2>
                <h2 class="todolist-incomplete <%= 'text-'+summary?.color %>"><%= summary?.numItems ?? 0 %></h2>
            </div>
            <div class="todolist-actions">
                <span class="todolist-actions-count"><%= summary?.completed ?? 0 %> Completed</span>
                <i class="todolist-actions-separator fa-solid fa-circle"></i>
                <span class="todolist-actions-item <%= 'text-'+summary?.color %>"
                    (click)="handleToggleShowComplete"
                    >
                    <%= showComplete ? 'Hide' : 'Show' %>
                </span>
                <i class="todolist-actions-separator fa-solid fa-circle"></i>
                <span class="todolist-actions-item <%= 'text-'+summary?.color %>"
                    (click)="handleClearCompletedItems"
                    >
                    Clear
                </span>

                <div class="todolist-actions-add todolist-actions-item" (click)="handleClickAdd">
                    <span class="<%= 'text-'+summary?.color %>">Add</span>
                    <i class="fa-solid fa-plus <%= 'text-'+summary?.color %>"></i>
                </div>
                
            </div>
            
            <div class="todolist-body">
                <% if (items) { %>
                    <% items.forEach((todo, i) => { %>
                        <div class="todolist-item-scroll-container">
                        <div class="todolist-item-container">
                            <div class="todolist-item">
                                <ui-circle-checkbox 
                                    state="<%= {
                                        color: summary.color,
                                        checked: todo.done
                                    } %>"
                                    data-todo-id="<%= todo.id %>"
                                    (checked)="handleTodoCheckedChange"
                                >
                                </ui-circle-checkbox>
                                <div class="todolist-item-input-container">
                                    <input type="text" 
                                        id="todolist-item-input-<%= todo.id %>"
                                        value="<%= todo.title %>"
                                        class="todolist-item-input" 
                                        style="width: <%= (todo.title?.length + 1)*8 %>px; height: auto; overflow: auto;"
                                        data-todo-id="<%= todo.id %>"
                                        onkeypress="this.style.width = ((this.value.length + 2) * 8) + 'px';"
                                        (change)="handleTodoTitleChange"
                                        (keydown)="handleKeyPress"
                                        (focusout)="handleFocusOut"
                                        />
                                </div>
                            </div>
                            <div 
                                class="todolist-item-delete" 
                                data-todo-id="<%= todo.id %>"
                                (click)="handleTodoDelete">
                                <i class="far fa-trash-can"></i>
                                <span>Delete</span>
                            </div>
                        </div>
                        </div>
                    <% }) %>
                <% } %>

                <% if (completed && showComplete) { %>
                    <% completed.forEach((todo, i) => { %>
                        <div class="todolist-item-scroll-container">
                        <div class="todolist-item-container">
                            <div class="todolist-item">
                                <ui-circle-checkbox 
                                    state="<%= {
                                        color: summary.color,
                                        checked: todo.done
                                    } %>"
                                    data-todo-id="<%= todo.id %>"
                                    (checked)="handleTodoCheckedChange"
                                >
                                </ui-circle-checkbox>
                                <div class="todolist-item-input-container">
                                    <input type="text" 
                                        id="todolist-item-input-<%= todo.id %>"
                                        value="<%= todo.title %>"
                                        class="todolist-item-input" 
                                        style="width: <%= (todo.title?.length + 1)*8 %>px; height: auto; overflow: auto;"
                                        data-todo-id="<%= todo.id %>"
                                        onkeypress="this.style.width = ((this.value.length + 2) * 8) + 'px';"
                                        (change)="handleTodoTitleChange"
                                        (keydown)="handleKeyPress"
                                        (focusout)="handleFocusOut"
                                        />
                                </div>
                            </div>
                            <div 
                                class="todolist-item-delete" 
                                data-todo-id="<%= todo.id %>"
                                (click)="handleTodoDelete">
                                <i class="far fa-trash-can"></i>
                                <span>Delete</span>
                            </div>
                        </div>
                        </div>
                    <% }) %>
                <% } %>
            </div>
        `;
    }

    static style() {
        return /* css */`
            todo-list {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100vh;
                max-width: 100%;
                max-height: 100%;
            }

            .todolist-summary {
                display: flex;
                flex-direction: row;
                padding: 0 1rem;
                color: var(--blue);
            }

            .todolist-summary .todolist-header {
                flex-grow: 1;
                font-size: 2.5rem;
                line-height: 2rem;
            }

            .todolist-summary .todolist-incomplete {
                font-size: 2.5rem;
                line-height: 2rem;
            }

            .todolist-body {
                flex-grow: 1;
                padding: 0;
                max-width: 100%;
                overflow-x: hidden;
            }

            .todolist-actions {
                display: flex;
                flex-direction: row;
                margin: 0 1rem;
                padding-bottom: 0.5rem;
                align-items: center;
                border-bottom: 1px solid var(--gray-l);
            }

            .todolist-actions .todolist-actions-count {
                color: var(--gray-d);
            }

            .todolist-actions .todolist-actions-separator {
                font-size: 0.2rem;
                margin: 0 0.5rem;
            }

            .todolist-actions .todolist-actions-item {
                cursor: pointer;
            }

            .todolist-actions .todolist-actions-add {
                display: flex;
                flex-grow: 1;
                justify-content: end;
                align-items: center;
            }

            .todolist-actions .todolist-actions-add i {
                margin-left: 0.25rem;
            }

            .todolist-body .todolist-item-scroll-container {
                display: block;
                height: 2.5rem;
                overflow-y: hidden;
            }

            .todolist-body .todolist-item-container {
                display: block;
                height: 2.5rem;
                overflow-x: scroll;
                overflow-y: hidden;
                white-space: nowrap;
                padding-bottom: 18px;
                box-sizing: content-box;
            }

            .todolist-body .todolist-item {
                display: inline-flex;
                flex-direction: row;
                align-items: center;
                width: 100%;
                padding-left: 1rem;
            }

            .todolist-body .todolist-item ui-circle-checkbox {
                margin-right: 1rem;
                padding: 0.25rem 0;
            }

            .todolist-body .todolist-item .todolist-item-label {
                flex-grow: 1;
                padding: 0.5rem 0;
                border-bottom: 1px solid var(--gray-l);
            }

            .todolist-body .todolist-item .todolist-item-input-container {
                flex-grow: 1;
                padding: 0.6rem 0 0.5rem 0;
                margin-right: 2rem;
                border: none;
                border-bottom: 1px solid var(--gray-l);
            }

            .todolist-body .todolist-item .todolist-item-input {
                max-width: 100%;
                border: none;
            }

            .todolist-body .todolist-item .todolist-item-input:focus-visible {
                outline: none;
            }

            .todolist-body .todolist-item-container .todolist-item-delete {
                display: inline-flex;
                flex-direction: row;
                align-items: center;
                width: 80px;
                height: 100%;
                margin-left: -1rem;
                vertical-align: top;
                background: var(--red);
                color: var(--white);
                justify-content: center;
                cursor: pointer;
            }

            .todolist-body .todolist-item-container .todolist-item-delete i {
                margin-right: 5px;
                pointer-events: none;
            }

            .todolist-body .todolist-item-container .todolist-item-delete span {
                pointer-events: none;
            }

            
        `;
    }

    onInit() {
        // console.log('TodoList.init: state =>', this.state);
        const { uiStore } = this.services;

        this.subscriptions = [];
        this.subscriptions.push(
            uiStore.sub('selectedListSummary', summary => this.setState({summary})),
            uiStore.sub('itemSummaries', items => this.setState({items})),
            uiStore.sub('addedItemId', id => this.activateListItem(id)),
            uiStore.sub('showComplete', showComplete => this.setState({showComplete})),
        );
    }

    onDestroy() {
        this.subscriptions?.forEach(sub => sub.unsubscribe());
    }


    // api ---------------------------------------------------------------------

    activateListItem(itemId) {
        // console.log('activateId:', itemId);
        if (itemId) {
            const sel = '#todolist-item-input-'+itemId;
            // console.log('sel:', sel);
            const input = this.querySelector(sel);
            // console.error('input:', input)
            input?.focus();
        }
    }

    deactivateListItem(itemId) {
        console.log('deactivateId:', itemId);
        if (itemId) {
            const sel = '#todolist-item-input-'+itemId;
            // console.log('sel:', sel);
            const input = this.querySelector(sel);
            // console.error('input:', input)
            input?.blur();
        }
    }


    sayWowza(e) {
        console.error('e:', e);
        console.error('WOWZAA!!');
        e.stopPropagation();
    }

    // event handlers ----------------------------------------------------------

    async handleClickAdd() {
        console.error('Adding item');
        await this.services.presenter.addTodoItem();
    }

    async handleTodoTitleChange(e) {
        const {presenter} = this.services;
        console.log('handleTodoTitleChange:', e);

        const itemId = parseInt(e.target.dataset.todoId);
        await presenter.updateTodoItem(itemId, {title: e.target.value})
    }

    async handleTodoCheckedChange(e) {
        const {presenter} = this.services;

        console.log('handleTodoCheckedChange', e);
        const todoId = parseInt(e.target.dataset.todoId);
        const checkedVal = e.detail.data;
        console.log('checkedVal', checkedVal)
        await presenter.updateTodoItem(todoId, {done: checkedVal});
        // setTimeout(() => {
        //     // TODO: causes bug, things appear checked even if they are not
        //     this.refresh();
        // }, 5000)
    }

    async handleTodoDelete(e) {
        const {presenter} = this.services;

        console.log('handleTodoDelete', e, e.target, e.target.dataset.todoId);
        const todoId = parseInt(e.target.dataset.todoId);
        await presenter.deleteTodoItem(todoId);
    }

    async handleKeyPress(e) {
        console.log('TodoList.handleKeyPress:', e);
        const key = e.key;
        const itemId = parseInt(e.target.dataset.todoId);
        const {presenter} = this.services;
        switch(key) {
            case 'Enter':
                if (itemId && e.target.value) {
                    await presenter.addTodoItem(itemId);
                } else if (itemId && !e.target.value) {
                    e.target.blur();
                }
                break;
            case 'Escape':
                if (itemId) this.deactivateListItem(itemId);
                break;
            default:
                break;
        }
    }

    async handleFocusOut(e) {
        console.log('focusout:', e);
        const { presenter } = this.services;
        const itemId = parseInt(e.target.dataset.todoId);
        const val = e.target.value;
        if (itemId && !val) {
            await presenter.deleteTodoItem(itemId);
        }
    }

    handleToggleShowComplete() {
        const { presenter } = this.services;
        presenter.toggleShowComplete();
    }

    async handleClearCompletedItems() {
        const {presenter} = this.services;
        console.log('Clear completed items');
        await presenter.deleteCompletedItems();
    }
}

export default TodoList;