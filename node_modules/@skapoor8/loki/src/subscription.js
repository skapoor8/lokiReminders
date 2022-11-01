export default class Subscription {
    constructor(store, event, callback) {
        // console.log(`Store: e => ${event} cb => ${callback}`)
        this.s = store;
        this.e = event;
        this.cb = callback;
        // console.log(`Store: after subscribe =`, this.s)
    }

    value() {
        this.s.value(this.e);
    }

    unsubscribe() {
        this.s.removeEventListener(this.e, this.cb);
        // console.log(`Store: after unsubscribe = `, this.s)
    }
}