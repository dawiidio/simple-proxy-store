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
   */
  const runSubscribers = (storeObjectKey, newStore) => {
    const subscribersToRun = subscribers[storeObjectKey];

    if (subscribersToRun && subscribersToRun.length)
      subscribersToRun.forEach(subscriber => subscriber(newStore))
  };

  /**
   * runs subscribers for root chanel (all store changes)
   *
   * @param args
   */
  const runRootSubscribers = (...args) => {
    subscribers[ROOT_SUBSCRIBERS_KEY].forEach(subscriber => subscriber(...args));
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

          const newProxyStore = {
            ...proxyStore,
            [storeObjectKey]: {
              proxy: proxyStore[storeObjectKey].proxy,
              target: currentTarget,
              newTarget: {
                ...currentTarget,
                [key]: value
              }
            }
          };

          runSubscribers(storeObjectKey, newProxyStore);
          runRootSubscribers(newProxyStore);

          proxyStore = newProxyStore;
          currentTarget[key] = value;

          return true;
        }
      };

      return {
        [storeObjectKey]: {
          proxy: new Proxy(target, proxyDefinition),
          target,
          newTarget: {...target}
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
