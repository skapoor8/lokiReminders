import Loki from '@skapoor8/loki';
import { TodoIndexPresenter } from '../../services/todo-index.presenter';
import { TodoService } from '../../services/todo.service';
import { UIStore } from '../../stores/ui-store';


class TodoIndexModal extends Loki.Component {
    static selector = 'todo-index-modal';

    static services = {
      presenter: TodoIndexPresenter,
      todoService: TodoService,
      uiStore: UIStore
    };

    static events = [
      'show',
      'hide'
    ];

    render() {
        return /* html */`
          <!-- The Modal -->
          <div el="bg" class="todo-index-modal-bg" style="display: <%= visible ? 'flex' : 'none' %>">
          
          <!-- Modal content -->
          <div class="todo-index-modal-content">
            <span class="todo-index-modal-header"><%= mode === 'new' ? 'New List' : 'Edit List' %></span>

            <div class="todo-index-modal-content-row">
              <label class="todo-index-modal-content-row-label">Name:</label>
              <input class="todo-index-modal-content-row-input" type="text"
                value="<%= title ?? '' %>"
                (input)="handleTitleChange"
              />
            </div>

            <div class="todo-index-modal-content-row">
              <span class="todo-index-modal-content-row-label">Color:</span>
              <div class="todo-index-modal-content-row-input todo-index-modal-content-row-color">
                <input name="color" type="radio" class="todo-index-modal-color-input red"
                  <%= color === 'red' ? 'checked' : '' %> data-color="red" (click)="handleColorSelect"
                />
                <input name="color" type="radio" class="todo-index-modal-color-input maroon" 
                  <%= color === 'maroon' ? 'checked' : '' %> data-color="maroon" (click)="handleColorSelect"
                />
                <input name="color" type="radio" class="todo-index-modal-color-input blue" 
                  <%= color === 'blue' ? 'checked' : '' %> data-color="blue" (click)="handleColorSelect"
                />
                <input name="color" type="radio" class="todo-index-modal-color-input lightblue" 
                  <%= color === 'lightblue' ? 'checked' : '' %> data-color="lightblue" (click)="handleColorSelect"
                />
                <input name="color" type="radio" class="todo-index-modal-color-input green" 
                  <%= color === 'green' ? 'checked' : '' %> data-color="green" (click)="handleColorSelect"
                />
                <input name="color" type="radio" class="todo-index-modal-color-input yellow" 
                  <%= color === 'yellow' ? 'checked' : '' %> data-color="yellow" (click)="handleColorSelect"
                />
                <input name="color" type="radio" class="todo-index-modal-color-input purple" 
                  <%= color === 'purple' ? 'checked' : '' %> data-color="purple" (click)="handleColorSelect"
                />
                <input name="color" type="radio" class="todo-index-modal-color-input brown" 
                  <%= color === 'brown' ? 'checked' : '' %> data-color="brown" (click)="handleColorSelect"
                />
                <input name="color" type="radio" class="todo-index-modal-color-input pink" 
                  <%= color === 'pink' ? 'checked' : '' %> data-color="pink" (click)="handleColorSelect"
                />
                <input name="color" type="radio" class="todo-index-modal-color-input orange" 
                  <%= color === 'orange' ? 'checked' : '' %> data-color="orange" (click)="handleColorSelect"
                />
              </div>
            </div>

            <div class="todo-index-modal-content-row todo-index-modal-content-button-row">
              <div class="todo-index-modal-content-row-left-padding"></div>
              <button (mousedown)="handleClose" class="todo-index-modal-cancel">Cancel</button>
              <% if (title && mode === 'edit') { %>
                <button el="okButton" class="todo-index-modal-ok" (click)="handleUpdateList">OK</button>
              <% } else if (title && mode === 'new') {%>
                <button el="okButton" class="todo-index-modal-ok" (click)="handleCreateList">OK</button>
              <% } else { %>
                <button el="okButton" class="todo-index-modal-ok" disabled (click)="handleCreateList">OK</button>
              <% } %>
            </div>
          </div>
        
          </div>
        `;
    }

    static style() {
        return /* css */` 
          /* The Modal (background) */
          .todo-index-modal-bg {
            display: none; /* Hidden by default */
            align-items: center;
            justify-content: center;
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            left: 0;
            top: 0;
            width: 100vw; /* Full width */
            height: 100vh; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
          }

          /* Modal Content/Box */
          .todo-index-modal-content {
            display: flex;
            flex-direction: column;
            background-color: #fefefe;
            margin: 15% auto; /* 15% from the top and centered */
            padding: 1rem;
            border: 1px solid #888;
            border-radius: 0.5rem;
            width: 70%; /* Could be more or less, depending on screen size */
          }

          .todo-index-modal-header {
            font-weight: bold;
            margin-bottom: 1.5rem;
          }

          .todo-index-modal-content-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 1rem;
            gap: 5px;
          }

          .todo-index-modal-content-row-label {
            width: 45px;
          }

          .todo-index-modal-content-row-input {
            flex: 1;
          }

          .todo-index-modal-content-row-left-padding {
            flex: 1;
          }

          .todo-index-modal-content-row-input.todo-index-modal-content-row-color {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .todo-index-modal-color-input.red {
            background: var(--red);
          }

          input[type='radio'].todo-index-modal-color-input:after {
            width: 15px;
            height: 15px;
            border-radius: 15px;
            top: -2px;
            left: -1px;
            position: relative;
            content: '';
            display: inline-block;
            visibility: visible;
            border: 2px solid white;
          }
      
          input[type='radio'].todo-index-modal-color-input:checked:after {
            width: 15px;
            height: 15px;
            border-radius: 15px;
            top: -2px;
            left: -1px;
            position: relative;
            content: '';
            display: inline-block;
            visibility: visible;
            border: 3px solid #70c8fb;
          }

          input[type='radio'].todo-index-modal-color-input.red:after {
            background-color: var(--red);
          }

          input[type='radio'].todo-index-modal-color-input.maroon:after {
            background-color: var(--maroon);
          }

          input[type='radio'].todo-index-modal-color-input.blue:after {
            background-color: var(--blue);
          }

          input[type='radio'].todo-index-modal-color-input.lightblue:after {
            background-color: var(--lightblue);
          }

          input[type='radio'].todo-index-modal-color-input.green:after {
            background-color: var(--green);
          }

          input[type='radio'].todo-index-modal-color-input.yellow:after {
            background-color: var(--yellow);
          }

          input[type='radio'].todo-index-modal-color-input.purple:after {
            background-color: var(--purple);
          }

          input[type='radio'].todo-index-modal-color-input.brown:after {
            background-color: var(--brown);
          }

          input[type='radio'].todo-index-modal-color-input.pink:after {
            background-color: var(--pink);
          }

          input[type='radio'].todo-index-modal-color-input.orange:after {
            background-color: var(--orange);
          }

          .todo-index-modal-content-button-row {
            gap: 15px;
          }

          button {
            border: thin solid #dbdbdb;
            border-radius: 5px;
            padding: 3px 5px;
            width: 70px;
            box-shadow: 0px 1px 2px 0px #c7c0c09e
          }


          /* The Close Button */
          .todo-index-modal-cancel {
            
          }

          .todo-index-modal-ok:not([disabled]) {
            background-color: var(--blue);
            color: var(--white);
          }



          .todo-index-modal-close:hover,
          .todo-index-modal-close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
          }
        `;
    }

    onBeforeInit() {
      this.state = {
        title: '',
        visible: false,
        color: 'red',
        mode: 'new'
      };
    }

    onInit() {
      const { uiStore } = this.services;
      this.subscriptions = [];
      this.subscriptions.push(
        uiStore.sub('todoIndexModalState', state => this.setState(state))
      );
    }

    // api ---------------------------------------------------------------------
    show(mode) {
      const { uiStore, presenter } = this.services;

      presenter.openCreateModal();

      this.emit('show');
    }

    hide() {
      const { uiStore, presenter } = this.services;

      uiStore.pub('todoIndexModalState', {visible: false, title: '', color: 'red', mode: 'new', editingListId: null});
      
      this.emit('hide');
    }

    async editList(listId) {
      const { presenter, todoService } = this.services;
      await presenter.openEditModal();
      this.emit('show');
    }

    // event handlers ----------------------------------------------------------
    handleClose() {
      this.hide();
      
    }

    handleTitleChange(e) {
      const newTitle = e.target.value;
      // console.log('target.value =', newTitle);
      this.state.title = newTitle;

      if (newTitle) {
        this.elements.okButton.disabled = false;
      } else {
        this.elements.okButton.disabled = true;
      }
    }

    handleColorSelect(e) {
      const selectedColor = e.target.dataset.color;
      // console.log('handleColorSelect, sel =', selectedColor);
      this.state.color = selectedColor;
    }

    async handleCreateList() {
      const {presenter} = this.services;
      await presenter.createList(this.state.title, this.state.color);
      this.hide();
    }

    async handleUpdateList() {
      const { todoService } = this.services;
      await todoService.updateList(this.state.editingListId, this.state.title, this.state.color);
      this.hide();
    }

}

export default TodoIndexModal;