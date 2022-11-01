import Evented from './evented';
import DIContainer from './ioc-container';
import IocContainer from './ioc-container';
import SubscriptionManager from './subscription-manager';

/**
 * Services should handle
 * 
 * 1. deleteing relevant data
 * 2. knowing which component created them
 * 3. loading
 * 4. basic service logic - fetch, error handling, auth...
 */

export default class Service extends Evented {
    static services = {};
    static events = ['loadSuccess', 'loadFailure'];
   
    constructor() {
        super();
        // this.sm = new SubscriptionManager(store);
        this.loadSuccess = false;
        this.services = {};

        this._registerEvents();
        this._initServices();
        this.onBeforeLoad()
        this.load()
        .then(async () => {
            this.loadSuccess = true;
            await this.onLoad()
            this.dispatchEvent('loadSuccess');
        })
        .catch(e => {
            this.loadSuccess = false;
            this.dispatchEvent('loadFailure');
        });
    }

    async load() {}

    unload() {
        // this.sm.unsubscribeAll();
        this.onBeforeUnload();
        this.removeEventListeners();
        this.onUnload();
    }

    // lifecycle methods

    onBeforeLoad() {}
    onLoad() {}
    onBeforeUnload() {}
    onUnload() {}

    // helpers

    _registerEvents() {
        this.constructor.events.forEach(e => {
            this.registerEvent(e);
        });
    }

    _initServices() {
        for (let key in this.constructor.services) {
            const serviceClass = this.constructor.services[key];
            this.services[key] = DIContainer.get(serviceClass);
        }
    }
}