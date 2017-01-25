# gesco

[![npm version](https://img.shields.io/npm/v/gesco.svg?style=flat-square)](https://www.npmjs.org/package/gesco)
[![npm downloads](https://img.shields.io/npm/dm/gesco.svg?style=flat-square)](http://npm-stat.com/charts.html?package=gesco)

## Installing

Using npm:

```bash
$ npm install gesco
```

Using bower:

```bash
$ bower install gesco
```

## Example

```js
const gesco = Gesco();

gesco.compute('id', 'name', function (name) {
    return name.toString().toLowerCase().replace(/\s/g, '');
});

gesco.compute('birthday', function (birthday) {
    var date = new Date(birthday);

    return {
        day: date.getUTCDate(),
        month: date.getUTCMonth() + 1,
        year: date.getUTCFullYear()
    };
});

gesco.compute('birthday.century', 'birthday', function (birthday) {
    return Math.ceil(birthday.year / 100);
});

gesco.set({
    'name': 'John Doe',
	'birthday': '04-07-2000'
});

//{"name":"John Doe","id":"johndoe","birthday":{"day":7,"month":4,"year":2000,"century":20}}
```

## API

##### gesco.get()
```js
// Getting data stored
gesco.get();
```

##### gesco.get(path)
```js
// Getting data in specific path
gesco.get('user.name');
```

##### gesco.set(path, value)
```js
// Setting "user"
gesco.set('user', {
    'id': 10
});

// Setting "user.name"
gesco.set('user.name', 'John Doe');

// Setting "user.friends"
gesco.set('user.friends', ['John Troe']);
```

##### gesco.set(path, value, observer)
```js
// Setting "user.name" and adding an observer
gesco.set('user.name', 'John Troe', function (newName) {
  console.log('the user has changed him name to', newName);
});
```

##### gesco.set(map)
```js
// Setting multiples paths
gesco.set({
    'user.id': '10'
    'user.name', 'John Doe',
    'foo': 'bar'
});
```

##### gesco.observe(path, callback)
```js
// Adding an observer to watch "user.name" modifications
gesco.observe('user.name', function (newName) {
  console.log('the user has changed him name to', newName);
});
```
```js
// Adding multiples observers to watch "user.name" modifications
gesco.observe('user.name', function (newName) {
  console.log('the user has changed him name to', newName);
}, function (newName) {
  console.log('the new name -', newName, '- is cool!');
});
```

##### gesco.compute(path, computer)
```js
// Adding a computer that watch and preprocess data
gesco.compute('user.name', function (name) {
  //capitalizing the name
  return name.replace(/\b\w/g, x => x.toUpperCase());
});
```

##### gesco.compute(path, observerPath, computer)
```js
// Adding a computer that watch a specific path and its result is stored as another path
gesco.compute('user.nameWithoutSpaces', 'user.name', function (name) {
  return name.replace(/\s/g, '');
});
```

##### gesco.emit(path)
```js
// Pushing item to array (without side-effects)
gesco.get('user.friends').push('John Troe');

//Notifying changes to activate observers
gesco.emit('user.friends');
```

##### gesco.emit(path, callback)
```js
// Executing callback, then notifying changes to activate observers
gesco.emit('user.friends', function (friends) {
  friends.push('John Troe');
});
```

##### gesco.toString()
```js
// Returning data processed by JSON.stringify
gesco.toString();
```

## Path
It can be array or strings (using dots)
```js
gesco.get(['user', 'name']);
//or
gesco.get('user.name');
```

## License

MIT. Copyright (c) 2017 Isaac Ferreira (zaclummys)
