# gesco [![npm version](https://img.shields.io/npm/v/gesco.svg?style=flat-square)](https://www.npmjs.org/package/gesco) [![npm downloads](https://img.shields.io/npm/dt/gesco.svg?style=flat-square)](http://npm-stat.com/charts.html?package=gesco)

Easy data manipulation to **get**, **emit**, **set**, **compute** and **observe**.

## Installing

```bash
$ npm install gesco
```
## API

---

#### `gesco.get<T = any>(path: PathLike): T`
Get the value stored in the path.
```js
gesco.get('foo.bar');
```

---

#### `gesco.delete(path: PathLike, silently: boolean = false)`
Delete the value stored in the path. See [silently](#silently).
```js
gesco.delete('foo.bar');
```

---

#### `gesco.emit<T = any>(path: PathLike: callback?: EmitCallback<T>)`
Bubbles the value changes. See [bubbles](#bubbles).

```js
gesco.emit('foo.bar')
```

```js
gesco.emit('foo', foo => {
    foo.push('bar');
})
```

*Since changing a property directly or using array methods won't [bubble](#bubbles), this allows you to indicate to Gesco that there has been a change/transformation. Use `callback` to perform operations like that.*

---

#### `gesco.set<T = any>(path: PathLike, value: any, silently: boolean = false): void`
Stores a value in the path. See [silence](#silence).

```js
gesco.set('foo', 'bar');
```

---

#### `gesco.observe<T = any>(from: PathLike, callback: ObserverCallback<T>): void`

Observe the path and the descending paths.

```js 
gesco.observe('foo.bar', bar => {
    console.log('bar has changed:', bar);
});
```

---

#### `gesco.compute<T = any>(to: PathLike, from: PathLike, callback: ComputerCallback<T>): void`

Compute the path and the descending paths.

```js 
gesco.compute('newBar', 'foo.bar', bar => bar.toUpperCase());
```

---

#### `gesco.link(from: PathLike, to: PathLike, bidirectional: boolean = false)`

Links two different paths.

```js 
gesco.link('path1', 'path2');
```

---

## Bubbles
This term refers to triggering the direct and indirect observers/computers of a path.

*The methods `set`, `delete` and `emit` bubble the value changes automatically when invoked.*

## Silence
This term refers to prevent [bubbling](#bubbles) the value changes.

## Propagation
When a value is changed, the change propagates to the path itself and its descendants. For example, changing `foo` will trigger:
- `foo`
- `foo.bar`
- `foo.bar.quux`

## License

MIT © Isaac Ferreira <zaclummys@gmail.com>
