### 1.0.4
`subscribe` function from now is delivered with connected store,
we can have many stores at the same time
### 1.0.5
Fixed wrong approach to store updates, I was too much focused 
on how to keep old store rather than provide new one for comparison
to subscribers. It's seems to be better solution and from now for
all subscribers we provide new version of store, when old is still
the same place for comparison
