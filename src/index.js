const ROOT_SUBSCRIBERS_KEY = 'root';

/**
 * create store which can be later passed eg. to React provider
 *
 * @public
 * @param store
 * @param middlewares
 */
export const createStore = (store, ...middlewares) => {
  const storeKeys = Object.keys(store);

  const subscribers = {
    [ROOT_SUBSCRIBERS_KEY]: []
  };

  let proxyStore = null;

  /**
   * adds subscriber to chanel, if it needed create chanel
   *
   * @param storeKey
   * @param subscriber
   */
  const addSubscriberAndOrCreateSubscribeChanel = (storeKey, subscriber = null) => {
    if (!(storeKey in subscribers))
      subscribers[storeKey] = [];

    if (subscriber)
      subscribers[storeKey].push(subscriber);
  };

  /**
   * subscribe to chanel. Can be used with es6+ decorator (@) syntax
   *
   * @param storeKeys {array<string>}
   * @returns {function(*=)}
   */
  const subscribe = (storeKeys = []) => subscriber => {
    if (storeKeys.length)
      storeKeys.forEach(storeKey => addSubscriberAndOrCreateSubscribeChanel(storeKey, subscriber));
    else
      addSubscriberAndOrCreateSubscribeChanel(ROOT_SUBSCRIBERS_KEY, subscriber)
  };

  /**
   * runs subscribers for one chanel
   *
   * @private
   * @param proxy
   * @param key
   * @param value
   * @param storeObjectKey
   * @param oldValue
   */
  const runSubscribers = ({proxy, key, value, storeObjectKey, oldValue}) => {
    const subscribersToRun = subscribers[storeObjectKey];

    if (subscribersToRun && subscribersToRun.length)
      subscribersToRun.forEach(subscriber => subscriber({key, value, oldValue, proxy, storeObjectKey}))
  };

  /**
   * runs subscribers for root chanel (all store changes)
   *
   * @param args
   */
  const runRootSubscribers = (...args) => {
    subscribers[ROOT_SUBSCRIBERS_KEY].forEach(subscriber => subscriber({...args}));
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

          const data = {
            proxy: proxyStore[storeObjectKey].proxy,
            key,
            value,
            storeObjectKey,
            oldValue: currentTarget[key]
          };

          currentTarget[key] = value;
          proxyStore[storeObjectKey].oldTarget = {...currentTarget};

          runSubscribers(data);
          runRootSubscribers(data);

          return true;
        }
      };

      return {
        [storeObjectKey]: {
          proxy: new Proxy(target, proxyDefinition),
          target,
          oldTarget: null
        }
      }
    })
    .reduce((acc, value) => ({
      ...acc,
      ...value
    }), {});

  return {
    __store: proxyStore,
    get store() {
      return storeKeys
        .map(storeKey => {
          return {
            [storeKey]: proxyStore[storeKey].proxy
          }
        })
        .reduce((acc, value) => ({
          ...acc,
          ...value
        }), {});
    },
    subscribe
  }
};


