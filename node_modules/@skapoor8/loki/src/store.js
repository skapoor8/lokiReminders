import Evented from './evented';
import Subscription from './subscription';
import Service from './service';
import clone from 'nodemon/lib/utils/clone';
import { cloneDeep } from 'lodash-es';

class Store extends Service {
    static nextUid = 0;

    constructor() {
        super();
        this.payloads = {};
        this.uid = 'store' + '-' + this.constructor.nextUid++
        this.init();
        for (let key in this.payloads) {
            this.registerEvent(key);
        }
    }

    subscribe(event, callback) {
        this.addEventListener(event, callback);
        const sub = new Subscription(this, event, callback);
        return sub;
    }

    init() {}

    sub(e, cb, skipFirst=true) {
        // console.error('sub:', e, cb);
        const sub = this.subscribe(e, cb);
        if (!skipFirst) {
            // if (e==='listSummaries') console.log(1, skipFirst)
            this.pub(e, this.val(e)); // move to parent func
        } else{
            // if (e==='listSummaries') console.log(2)
        }
        return sub;
    }

    value(event) {
        return this.payloads[event];
    }

    val(e) {
        return this.value(e);
    }

    publish(event, payload) {
        // if (payload[event] === undefined) {
        //     throw new Error(`Loki.Store: cannot publish properties ('${event}') that are not initialized`);
        // }
        this.payloads[event] = payload;
        this.dispatchEvent(
            event,
            payload
        )
    }  
    
    pub(e, payload) {
        // console.error('pub:', e, payload);
        this.publish(e, payload);
    }

    // over-ridden
    dispatchEvent(name, payload={}) {
        try {
            if (this.firesEvent(name)) {
                this.firing = true;
                if (this.eventTarget) {
                    // TODO: deliver payload through dom event
                    var e = new CustomEvent(name, payload);
                    // console.log('custom event called on', this.constructor.name, 'is', e);
                    this.eventTarget.dispatchEvent(e);
                } else {
                    this.listeners[name]?.length > 0 && this.listeners[name].forEach(cb => {
                        // console.log(`calling ${cb} with payload: ${ JSON.stringify(payload) }`)
                        cb(payload);
                    });
                }
                this.firing = false;
            }
            else {
                throw new Error(`Evented: no event ${name} registered`);
            }
        } catch(e) {
            console.error('dispatchEvent failed in Evented');
            console.error(e);
            this.firing = false;
            throw(e);
        }
    }
}

export default Store;