



class IocContainer {
  constructor() {
    this.injected = new Map();
  }

  _inject(service) {
    console.error('injecting:', service)
    this.injected.set(service, new service());
  }

  get(service) {
    let instance = this.injected.get(service);
    if (instance === undefined) {
      instance = new service();
      // console.error('injecting', service);
      this.injected.set(service, instance);
    }
    return instance;
  }
}

const DIContainer = new IocContainer();
export default DIContainer;