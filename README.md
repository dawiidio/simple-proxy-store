## Proxy store

Simple js store based on es6+ native proxy objects

### Motivation
With React@16.3 came new context api, which is pretty awesome and 
can replace too large, for small and medium projects, Flux
approach (in my opinion Redux needs too many boilerplate code, even 
creating store was tricky). 

Oh, and here we go - Proxy arrives at the stage with pretty awesome 
support from Browsers (caniuse almost green). These two features 
gives us powerful toolbox for creating great solutions.
In this project I want connect them into very simple, object based, 
store which will automatically detect changes (I know, it's a kind of magic) 
and inform subscribers about them.

This project is a PoC of store Core, in second step I'll create
connection for React.


### Samples

info object looks like: 
```js
{
  storeName, // {string} with store key
  key, // {string} key indicate which value changed
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
