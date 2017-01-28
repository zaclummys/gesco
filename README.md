[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2461addcb34844f086d314fc9871cfdf)](https://www.codacy.com/app/zaclummys/gesco?utm_source=github.com&utm_medium=referral&utm_content=zaclummys/gesco&utm_campaign=badger)
# gesco [![npm version](https://img.shields.io/npm/v/gesco.svg?style=flat-square)](https://www.npmjs.org/package/gesco) [![npm downloads](https://img.shields.io/npm/dm/gesco.svg?style=flat-square)](http://npm-stat.com/charts.html?package=gesco)

Easy data manipulation to **get**, **set**, **observe** and **compute**

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

gesco.compute('friendsLength', 'friends', function (friends) {
    return friends.length;
});

gesco.set({
    name: 'John Doe',
    birthday: '04-07-2000'
    friends: ['John Troe']
});

//"{"name":"John Doe","id":"johndoe","birthday":{"day":7,"month":4,"year":2000,"century":20},"friends":["John Troe"],"friendsLength":1}"
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
    id: 10,
    name: 'John Doe',
    friends: ['John Troe']
});

// Setting "user.id"
gesco.set('user.id', 10);

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

##### gesco.set(path, value, observer, silence)
```js
// Setting "user.name" without emit changes
gesco.set('user.name', 'John Troe', null, true);
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
gesco.get('foo.friends').push('John Troe');

//Notifying changes to activate observers
gesco.emit('user.friends');
```

```js
// Setting sub-property to object (without side-effects)
gesco.get('user').name = 'John Doe';

//Notifying changes to activate observers
gesco.emit('user.name');
```

##### gesco.emit(path, callback)
```js
// Executing callback, then notifying changes to activate observers automatically
gesco.emit('user.friends', function (friends) {
  friends.push('John Troe');
});
```
**Note:** Please, do NOT do this! It'll emit changes twice. Use above examples instead.
```js
gesco.emit('user.friends', function (friends, path) {
  this.set(path, value);
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
