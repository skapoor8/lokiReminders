/**
 * Filename:        component.js
 * Author:          Siddharth Kapoor
 * Purpose:         Lightweight component class
 */

import 'ejs/ejs.min.js';
import { cloneDeep } from 'lodash-es';
import trimStrart from 'lodash-es/trimStart.js';

import Evented from './evented.js';
import DIContainer from './ioc-container.js';

class Component extends Evented {
    static nextUid = 0;
    static selector = 'loki-component';
    static components = [];
    static events = [];
    static services = {};

    constructor(opts={}) {
        if (opts.selector) {
            super(opts);
            this.container = document.querySelector(opts.selector);
        } else if (opts.domElement) {
            super(opts);
            this.container = opts.domElement;
        } else {
            super(opts);
            var selector = this.constructor.selector;
            this.container = document.createElement(selector);
        }
        
        this.uid = this.constructor.selector + '-' + this.constructor.nextUid++;
        this.state = opts.state ? opts.state : {};
        this.elements = {};
        this.components = {};
        this.services = {};
        this.subscriptions = [];
        this._autoAttachedEventListenerDisposers = [];
        if (opts.toplevel) {
            this.toplevel = opts.toplevel;
            this.constructor._appendStyles({isRoot: true});  
        } 

        this._initServices();
        this.onBeforeInit();
        var {html, states} = EJS(this.render(), {...this.state, COMPONENT_UID: this.uid});
        // console.log(`Component ${this.uid}: constructor state: ${JSON.stringify({...this.state, COMPONENT_UID: this.uid})}`);
        // console.log(`Component ${this.uid}: constructor html: ${html}`);
        this.container.innerHTML = html;
        this._initComponents(states);
        this._captureElements();
        this._registerEvents();
        if (opts.toplevel) {
            this._autoAttachEventListeners();
        }
        this.addEventListeners();
        this.onInit();
    }

    // overridable methods -------------------------------------------------------------------------
    render() {
        return `<h1>Loki Component</h1>`;
    }

    static style() {
        return ``;
    }

    addEventListeners() {}

    // lifecycle methods ---------------------------------------------------------------------------
    onBeforeInit() {}
    onInit() {}
    onBeforeDestroy() {}
    onDestroy() {}
    onUpdateState(oldState, newState) {}

    // public methods ------------------------------------------------------------------------------
    static init(opts) {
        return new this.constructor({toplevel: true, ...opts});
    }

    setState(newState = {}) {
        // console.error(`Component: ${this.uid}`,'setState called:', newState);
        if (newState && typeof newState == 'object') {
            // this.beforeUpdate();
            // prevent unsub while rendering by pushing it to the next event cycle
            setTimeout(() => {
                this.unmount();
                this.onBeforeInit();
                this.state = {
                    ...this.state,
                    ...newState
                };
                // console.error(`Component ${this.uid}: setState state:`, this.state, this.container);
                var {html, states} = EJS(this.render(), {...this.state, COMPONENT_UID: this.uid});
                // console.error(`Component ${this.uid}: setState html:`, html);
                this.container.innerHTML = html;
                this._initComponents(states);
                this._captureElements();
                this._registerEvents();
                // if (this.toplevel) {
                    this._autoAttachEventListeners();
                // }
                this.addEventListeners();
                this.onInit();
            }, 1);
        }
    }

    refresh() {
        // console.error(`Component ${this.uid}: refresh called!`);
        setTimeout(() => {
            this.unmount();
            this.onBeforeInit();
            var {html, states} = EJS(this.render(), {...this.state, COMPONENT_UID: this.uid});
            this.container.innerHTML = html;
            this._initComponents(states);
            this._captureElements();
            this._registerEvents();
            // if (this.toplevel) {
                this._autoAttachEventListeners();
            // }
            this.addEventListeners();
            this.onInit();
        }, 1);
    }

    updateState(newState) {
        const oldState = cloneDeep(this.state);
        this.state = {
            ...this.state,
            ...newState
        };
        this.onUpdateState(oldState, this.state);
    }

    querySelector(sel) {
        var el = this.container.querySelector(sel);
        if (el?.dataset?.componentId) {
            return this.components[el.dataset.componentId];
        } else {
            return el;
        }
    }

    querySelectorAll(sel) {
        var els = this.container.querySelectorAll(sel);
        els.forEach((el, i) => {
            if (el?.dataset?.componentId) els[i] = this.components[el.dataset.componentId];
        });
        return els;
    }

    unmount() {
        this.onBeforeDestroy();
        this._removeEventListeners();
        this._releaseElements();
        this._unmountComponents();
        this.onDestroy();
    }
    
    // private methods -----------------------------------------------------------------------------
    static _appendStyles(opts={}) {
        if (opts.isRoot) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.id = this.selector+'-style';
            style.innerHTML = CSS(this.style(), this.selector);
            document.head.appendChild(style);
            this.components.forEach(c => {
                c._appendStyles({styleId: style.id, isRoot: false});
            });
        } else {
            if (opts.styleId) {
                var style = document.querySelector('#'+opts.styleId);
                style.innerHTML += CSS(this.style(), this.selector);
                this.components.forEach(c => {
                    c._appendStyles({styleId: opts.styleId, isRoot: false});
                });
            } else {
                throw new Error('Component: _appendStyles expects opts.styleId to append component' 
                                + ' to the correct style tag');
            }
        }
    }

    static _getRegisteredSelectors() {
        // get list of custom component selectors
        // console.log('constructor = ', this.components);
        return this.components.map(c => c.selector);
    }

    static _getSelectorToComponentMap() {
        var selMap = {};
        this.components.forEach(c => {
            selMap[c.selector] = c;
        });
        return selMap;
    }
    
    _autoAttachEventListeners() {
        // console.log('Attaching event listeners for component', this.uid);
        var blacklist = this.constructor._getRegisteredSelectors();
        var apply = (node) => {
            var isComponent = blacklist.includes(node.tagName.toLowerCase());
            var ds = JSON.parse(JSON.stringify(node.dataset))
            // console.log('apply: ', node, ds);
            for (var attr in ds) {
                if (/^eventon/g.test(attr)) {
                    var event = attr.replace('eventon', '').toLowerCase();
                    // console.log('Attaching function', this[ds[attr]], 'on event', event);
                    if (isComponent) {
                        var componentId = ds.componentId;
                        var component = this.components[componentId];
                        component.addEventListener(event, this[ds[attr]].bind(this));
                        // if (this.constructor.selector === 'app-page') {
                        //     console.log(`_autoAttachEventListeners: attaching event "${event}" with cb<${this[ds[attr]]}> to component`, component);
                        // }
                    } else {
                        // if (this.constructor.selector === 'app-search') {
                        //     console.log(`_autoAttachEventListeners: attaching event "${event}" with cb<${this[ds[attr]]}> to node`, node);
                        // }
                        node.addEventListener(event, this[ds[attr]].bind(this));
                    }
                }
            }
        }
        var children = [];
        for (var i = 0; i < this.container.childNodes.length; i++) {
            children.push(this.container.childNodes[i]);
        }
        inorderWalk(children, apply, blacklist);
        for (var cid in this.components) {
            var c = this.components[cid];
            c._autoAttachEventListeners();
        }
    }

    _removeEventListeners() {
        super.removeEventListeners();
        var blacklist = this.constructor._getRegisteredSelectors();
        var apply = (node) => {
            var isComponent = blacklist.includes(node.tagName.toLowerCase());
            var ds = JSON.parse(JSON.stringify(node.dataset))
            // console.log('apply: ', node, ds);
            for (var attr in ds) {
                if (/^on/g.test(attr)) {
                    // var event = attr.replace('on', '').toLowerCase();
                    // // console.log('Attaching function', this[ds[attr]], 'on event', event);
                    if (isComponent) {
                        // console.log()
                        var componentId = ds.componentId;
                        var component = this.components[componentId];
                        component?.removeEventListeners();
                    }
                }
            }
        }
        var children = [];
        for (var i = 0; i < this.container.childNodes.length; i++) {
            children.push(this.container.childNodes[i]);
        }
        inorderWalk(children, apply, blacklist);
        for (var cid in this.components) {
            var c = this.components[cid];
            c._removeEventListeners();
        }
    }
 
    _captureElements() {
        this.elements = [];
        var elements = this.container.querySelectorAll('[data-element]');
        var selMap = this.constructor._getSelectorToComponentMap();
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            // console.log('_captureElements tagName =', el.tagName);
            if (!this.constructor._getRegisteredSelectors().includes(el.tagName.toLowerCase())) {
                // console.log('element added');
                this.elements[el.dataset.element] = el;
            } else {
                this.elements[el.dataset.element] = this.components[el.dataset.componentId];
            }
        }
    }

    _releaseElements() {
        for (var el in this.elements) {
            delete this.elements[el];
        }
    }

    _initComponents(states) {
        var subcomponentSelectors = this.constructor._getRegisteredSelectors(); 
        var selectorToComponentMap = this.constructor._getSelectorToComponentMap();       

        // find all containers to render components in
        subcomponentSelectors.forEach(sel => {
            var targets = this.container.querySelectorAll(sel);
            // console.log('Initializing components in', this.constructor.name, ', targets for sel(', sel, ') are', targets);
            for (var i = 0; i < targets.length; i++) {
                // init components, store them in this.components
                var initState = states[parseInt(targets[i].dataset.stateStub)];
                var selectorClass = selectorToComponentMap[sel];
                var c = new selectorClass({domElement: targets[i], state: initState});
                if (targets[i].dataset.element) {
                    this.elements[targets[i].dataset.element] = c;
                }
                this.components[c.uid] = c;
                targets[i].dataset.componentId = c.uid;
            }
        });  
    }

    _unmountComponents() {
        for (var cid in this.components) {
            // console.error(`Component ${this.uid}: unmounting ${cid}`);
            var c = this.components[cid];
            c.unmount();
            delete this.components[cid];
            // console.error(`Component ${this.uid}: components after unmounting ${JSON.stringify(this.components)}`);

        }
    }

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

export default Component;

// helpers -----------------------------------------------------------------------------------------
function EJS(template, data) {
    // console.error(`Component.EJS: template: ${template} data =>`, data)
    template = template.replaceAll(' el=', ' data-element=');
    template = template.replaceAll(/\s\((\w+)\)="/g, ' data-eventon-$1="');
    template = template.replaceAll(/\sstate="<%=([\s\S]*?)%>"/g, " state=\"<%= JSON.stringify($1) %>\"");
    // console.error('template:', template, data);
    var processed = ejs.render(template, data);
    // console.error('processed:', processed);
    var states = [], stub = 0;
    processed = processed.replaceAll(/\sstate="(.*)"/g, function(match, token) {
        var transformer = document.createElement('div');
        // console.error('token:', token);
        transformer.innerHTML=token;
        states.push(JSON.parse(transformer.innerText));
        var replacement = ' data-state-stub="'+stub+'"';
        stub += 1;
        return replacement;
    });
    return {html: processed, states: states};
}

function CSS(styleString, scopeSelector) {
    var rules = styleString.split('}');
    rules.pop();
    // console.log('rules =', rules);
    rules = rules.map(r => ((new RegExp('\n*\s*'+scopeSelector, 'g')).test(r) ? '' : scopeSelector + ' ')  + trimStrart(r) + '}\n\n')
                .filter(r => r != '');
    // console.log('rules =', rules);
    return rules.join('');
}

function inorderWalk(parentNodes=[], apply, blacklist=[]) {
    var children = [];
    parentNodes.forEach(p => {
        if (p.nodeType == Node.ELEMENT_NODE) {
            apply(p);
            if (!blacklist.includes(p.tagName.toLowerCase())) {
                var pChildren = p.childNodes;
                for (var i = 0; i < pChildren.length; i++) {
                    children.push(pChildren[i]);
                }
            } 
        }
        
    });
    if (children.length > 0) {
        inorderWalk(children, apply, blacklist);
    }
}

