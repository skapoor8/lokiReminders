export default class SubscriptionManager{
    constructor(store) {
        this.s = store;
        this.subs = [];
    }

    subscribe(event, callback) {
        const sub = this.s.subscribe(event, callback);
        this.subs.push(sub);
    }

    unsubscribeAll() {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        });
    }
}