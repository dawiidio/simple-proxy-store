## Proxy store

Simple js store based on es6+ native proxy objects

### Samples

Basic use cases
```js
import {
    subscribe,
    createStore
} from 'simple-proxy-store';

subscribe()((...args) => {
  console.log(args);
});

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
```

```js
import {
    subscribe,
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
      this.data = await fetch('data.json'); // async works perfect!
    }
}

const myStore = createStore({
  a: new A(),
  b: new B()
});

// subscribe all changes
subscribe()((...args) => {
  console.log(args);
});

// subscribe only 'a' store
subscribe(['a'])((key, value, oldValue) => {
  console.log(`in store a value under key:${key} has changed from ${value} to ${oldValue}`);
});

myStore.a.setA();
myStore.b.fetchData();

myStore.a = 123;
```
