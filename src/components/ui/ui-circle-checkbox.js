import Loki from '@skapoor8/loki';

class UiCircleCheckbox extends Loki.Component {
    static selector = 'ui-circle-checkbox';

    static events = [
        'checked'
    ];

    render() {
        this.container.style.setProperty('--cb-color', 'var(--'+this.state.color+')')
        return /* html */`
            <input 
                type="checkbox" 
                id="<%= 'cbx-'+COMPONENT_UID %>"
                <%= checked ? 'checked' : '' %>
                (change)="handleCheckboxChange"
                >
            <label for="<%= 'cbx-'+COMPONENT_UID %>"></label>
        `;
    }

    static style() {
        return /* css */`
          ui-circle-checkbox {
            display: inline-block;
            width: 1.4em;
            height: 1.4em;
          }

          input[type="checkbox"] {
            display: none;
          }

          input[type="checkbox"] + label {
              display: block;
              position: relative;
              padding-left: 35px;
              margin-bottom: 20px;
              font: 14px/20px "Open Sans", Arial, sans-serif;
              cursor: pointer;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
          }

          input[type="checkbox"]:hover + label:hover {
              color: var(--cb-color);
          }

          input[type="checkbox"]:hover + label:before {
              border: 1px solid #343a3f;
              width: 1.2em;
              height: 1.2em;
              border: 2px solid #fff;
              /* background: var(--cb-color); */
              box-shadow: 0 0 0 1px var(--gray-m);
          }

          input[type="checkbox"] + label:last-child {
              margin-bottom: 0;
          }
          
          input[type="checkbox"] + label:before {
              content: "";
              display: block;
              width: 1.4em;
              height: 1.4em;
              border: 1px solid #ccced0;
              border-radius: 1em;
              position: absolute;
              left: 0;
              top: 0;
              background: none;
          }

          input[type="checkbox"]:checked + label:before {
              border-radius: 1em;
              border: 2px solid #fff;
              width: 1.2em;
              height: 1.2em;
              background: var(--cb-color);
              box-shadow: 0 0 0 1px var(--cb-color);
          }
        `;
    }

    handleCheckboxChange(e) {
        this.emit('checked', e.target.checked);
    }

}

export default UiCircleCheckbox ;