import Loki from '@skapoor8/loki';

class UiModal extends Loki.Component {
    static selector = 'ui-modal';

    static events = [
      'show',
      'hide'
    ];

    render() {
        return /* html */`
          <!-- The Modal -->
          <div el="bg" class="ui-modal-bg">
          
          <!-- Modal content -->
          <div class="ui-modal-content">
            <span (click)="hide" class="ui-modal-close">&times;</span>
            <p>Some text in the Modal..</p>
          </div>
        
          </div>
        `;
    }

    static style() {
        return /* css */` 
          /* The Modal (background) */
          .ui-modal-bg {
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
          .ui-modal-content {
            background-color: #fefefe;
            margin: 15% auto; /* 15% from the top and centered */
            padding: 20px;
            border: 1px solid #888;
            width: 70%; /* Could be more or less, depending on screen size */
          }

          /* The Close Button */
          .ui-modal-close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
          }

          .ui-modal-close:hover,
          .ui-modal-close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
          }
        `;
    }

    // api ---------------------------------------------------------------------
    show() {
      this.elements['bg'].style.display = "flex";
      this.emit('show');
    }

    hide() {
      this.elements['bg'].style.display = "none";
      this.emit('hide');
    }

}

export default UiModal ;