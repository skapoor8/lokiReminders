import Loki from '@skapoor8/loki';

class AppSearch extends Loki.Component {
    static selector = 'app-search';
    static events = ['change'];

    render() {
        return /* html */`
          <div class="appsearch-container">
            <span class="appsearch-icon fa-solid fa-magnifying-glass"></span>
            <input class="appsearch-input" type="text" placeholder="Search" (input)="onInputChange"/>  
          </div>
        `;
    }

    static style() {
        return /* css */`
          .appsearch-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0.25rem;
            margin: 1rem 0.5rem;
            background: var(--gray-m);
            border: thin solid var(--gray-m);
            border-radius: 5px;
          }

          .appsearch-container .appsearch-icon {
            padding: 0 0.25rem;
            color: var(--gray-d);
          }

          .appsearch-container .appsearch-input {
            margin-top: -2px;
            background: none;
            border: none;
            border-radius: 5px;
          }

          .appsearch-container .appsearch-input:focus-visible {
            border: none;
            outline: none;
          }

        `;
    }

    onInputChange(e) {
      // console.log('on input change:', e);
      this.dispatchEvent('change', e.srcElement.value);
    }


}

export default AppSearch;