
import ModelRegistry from "./model-registry";

export default class Model {
    static modelOverrides = {};

    constructor(data) {
        this.data = data;

    }

    validate() {
        
    }

    toJSON() {}

    static fromJSON() {}
}

// export class BaseModel {
//     static modelOverrides = {};
//     touched = false;
//     _modelCache = {};
  
//     constructor(data) {
//       return new Proxy(this, handler());
//     }
  
//     toString() {
//       return JSON.stringify(this.data);
//     }
  
//     valueOf() {
//       return this.data;
//     }
//   }
  
//   function handler() {
//     return {
//       get: (target, prop, receiver) => {
//         if (DEBUG) console.log(‘In BaseModel.get, target,prop = ‘, target, prop);
//         const desc = Object.getOwnPropertyDescriptor(
//           target.constructor.prototype,
//           prop
//         );
//         // console.log(‘desc = ‘, desc);
//         if (
//           target.hasOwnProperty(prop) ||
//           // prop === ‘data’ ||
//           // prop === ‘touched’ ||
//           // prop === ‘toString’ ||
//           // prop === ‘valueOf’ ||
//           // prop === ‘modelCache’ ||
//           (desc && (desc.get || desc.value))
//         ) {
//           return Reflect.get(target, prop, receiver);
//         } else if (
//           target.constructor.modelOverrides &&
//           target.constructor.modelOverrides.hasOwnProperty(prop)
//         ) {
//           // console.log(‘target.modelOverrides.prop =‘, target.constructor.modelOverrides[prop]);
//           // CASE 1: Array
//           if (Array.isArray(target.data[prop])) {
//             // CASE 1A: Cache Hit
//             if (target._modelCache[prop]) {
//               return target._modelCache[prop];
//             }
//             // CASE 1B: Cache Miss
//             const modelArray = new Proxy(
//               target.data[prop],
//               arrayHandler(target.constructor.modelOverrides[prop])
//             );
//             target._modelCache[prop] = modelArray;
//             return modelArray;
//           }
  
//           // CASE 2: Non-Array
  
//           // CASE 2A: Cache Hit
//           if (target._modelCache[prop]) {
//             return target._modelCache[prop];
//           }
//           // CASE 2B: Cache Miss
//           const model = new target.constructor.modelOverrides[prop](
//             target.data[prop]
//           );
//           target._modelCache[prop] = model;
//           return model;
//         }
//         return target.data[prop];
//       },
//       set: (target, prop, value) => {
//         if (DEBUG) console.log(‘In BaseModel.set, target,prop = ‘, target, prop);
//         target.touched = true;
//         const desc = Object.getOwnPropertyDescriptor(
//           target.constructor.prototype,
//           prop
//         );
//         // console.log(‘desc = ‘, desc);
//         if (
//           target.hasOwnProperty(prop) ||
//           // prop === ‘data’ ||
//           // prop === ‘touched’ ||
//           // prop === ‘toString’ ||
//           // prop === ‘valueOf’ ||
//           // prop === ‘modelCache’ ||
//           (desc && (desc.set || desc.value))
//         ) {
//           return Reflect.set(target, prop, value);
//         } else if (
//           target.constructor.modelOverrides &&
//           target.constructor.modelOverrides[prop]
//         ) {
//           if (Array.isArray(target.data[prop])) {
//             throw new Error(
//               `Model classes prohibit set operation on overrideen array elements. 
//               Use Array operation like Array.push, or implement set operation in model
//               method.`
//             );
//           }
//           if (target._modelCache[prop]) {
//             target._modelCache[prop] = value;
//           }
//           return (target.data[prop] = value.data);
//         }
//         return (target.data[prop] = value);
//       },
//       enumerate: (target, key) => {
//         return target.keys();
//       },
//     };
//   }
  
//   const arrayHandler = (typeConstructor) => {
//     const modelCache = [];
  
//     return {
//       get: (target, prop, receiver) => {
//         const index = parseInt(prop);
//         if (DEBUG)
//         //   console.log(
//         //     ‘arrayHandler: prop =‘,
//         //     prop,
//         //     index,
//         //     ‘modelCache = ‘,
//         //     modelCache,
//         //     ‘isNan(prop)’,
//         //     isNaN(index)
//         //   );
//         if (!isNaN(index) && target.hasOwnProperty(prop)) {
//           // console.log(‘arrayHandler: accessing index’, index, ‘type =‘, typeof index, ‘isNaN =‘, isNaN(index));
//           if (modelCache[index]) {
//             return modelCache[index];
//           } else {
//             const model = new typeConstructor(target[prop]);
//             modelCache[index] = model;
//             return model;
//           }
//         } else if (target.hasOwnProperty(prop)) {
//           return target[prop];
//         } else if (prop in Array.prototype) {
//           return Array.prototype[prop];
//         } else {
//           return undefined;
//         }
//       },
//       set: (target, prop, value) => {
//         const index = parseInt(prop);
//         if (!isNaN(index) && value.constructor === typeConstructor) {
//           if (modelCache[index]) {
//             modelCache[index] = value;
//           }
//           return (target[index] = value.data);
//         } else if (target.hasOwnProperty(prop)) {
//           return (target[prop] = value);
//         } else {
//           if (isNaN(index)) {
//             throw new Error(`
//               Model array prohibits set on non-integer properties
//             `);
//           } else {
//             throw new Error(`
//               Value of type ${typeConstructor.name} expected, but
//               found type ${value.constructor.name}
//             `);
//           }
//         }
//       },
//       enumerate: (target, key) => {
//         return target.keys();
//       },
//       has: (target, key) => {
//         return key in target || target.hasItem(key);
//       },
//     };
// };