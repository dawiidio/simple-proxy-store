import { Subject } from 'rxjs/Subject';
import { filter } from 'rxjs/operators';
import { pipe } from 'rxjs';

/**
 * create store which can be later passed eg. to React provider
 *
 * @public
 * @param store
 */
export const createStore = store => {
  const storeKeys = Object.keys(store);
  const subject = new Subject();

  let proxyStore = null;

  const subscribe = (select = []) => subscriber => {
    const __subject = !select.length
      ? subject
      : subject.pipe( filter(x => select.indexOf(x.storeName) > -1) );

    return __subject.subscribe(subscriber);
  };

  proxyStore = storeKeys
    .map(storeObjectKey => {
      const target = store[storeObjectKey];

      const proxyDefinition = {
        set: (currentTarget, key, value) => {
          if(key.startsWith('__')) {
            currentTarget[key] = value;
            return true;
          }

          subject.next({
            storeName: storeObjectKey,
            key,
            value,
            oldValue: currentTarget[key]
          });

          currentTarget[key] = value;

          return true;
        }
      };

      return {
        [storeObjectKey]: {
          proxy: new Proxy(target, proxyDefinition),
          target
        }
      }
    })
    .reduce((acc, value) => ({
      ...acc,
      ...value
    }), {});

  return {
    __store: proxyStore,
    subscribe,
    get store() {
      return storeKeys
        .map(storeKey => ({ [storeKey]: proxyStore[storeKey].proxy }))
        .reduce((acc, value) => ({ ...acc, ...value }), {});
    }
  }
};
