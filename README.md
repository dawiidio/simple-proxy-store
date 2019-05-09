## Proxy store

Simple js store based on es6+ native proxy objects


### Samples

info object looks like: 
```js
{
  storeName, // {string}  key indicate which store has updated
  key, // {string} key indicate which value has changed
  value, // {any} new value
  oldValue, // {any} old value
}
```

Basic use cases
```js
import {
    createStore
} from 'simple-proxy-store';

const myStore = createStore({
  test : new class {
    constructor(){
      this.a = 123;
    }

    setA() {
      this.a = Math.random()*100;
    }

    set c(val) {
      return val;
    }
  }
});

myStore.subscribe()((info) => {
  console.log(info);
});
```

```js
import {
    createStore
} from 'simple-proxy-store';

class A {
    constructor(){
        this.a = 123;
    }
    
    setA() {
      this.a = Math.random()*100;
    }
}

class B {
    constructor(){
        this.data = null; 
    }
    
    async fetchData() {
      this.data = await fetch('data-b.json'); // async works perfect!
    }
}

class C {
    constructor(){
        this.data = null; 
    }
    
    async fetchData() {
      this.data = await fetch('data-c.json'); // async works perfect!
    }
}

const {subscribe, store} = createStore({
  a: new A(),
  b: new B(),
  c: new C(),
});

// subscribe all changes
subscribe()(info => {
  console.log(info);
});

// subscribe only 'a' store
subscribe(['a'])((info) => {
  compareOldWithNewStore(info)
});

store.a.setA();
store.b.fetchData();

store.a = 123;
```
