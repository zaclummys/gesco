# gesco [![npm version](https://img.shields.io/npm/v/gesco.svg?style=flat-square)](https://www.npmjs.org/package/gesco) [![npm downloads](https://img.shields.io/npm/dm/gesco.svg?style=flat-square)](http://npm-stat.com/charts.html?package=gesco)

Easy data manipulation to **get**, **emit**, **set**, **compute** and **observe**

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
    return name.toLowerCase().replace(/\s/g, '');
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
    return "object" == typeof friends ? friends.length : 0;
});

gesco.set({
    name: 'John Doe',
    birthday: '01-01-2000',
    friends: ['John Troe']
});

//{"name":"John Doe","id":"johndoe","birthday":{"day":1,"month":1,"year":2000,"century":20},"friends":["John Troe"],"friendsLength":1}
```

## API

##### **gesco.get()**
```js
// Getting all data stored
gesco.get();
```

##### **gesco.get(path)**
```js
// Getting data in specific path
gesco.get('user.name');
```


----------


##### **gesco.set(path, value)**
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

##### **gesco.set(path, value, silent)**
```js
// Setting "user.name" without emit changes

gesco.set('user.name', 'John Troe', true);
```

##### **gesco.set(batch)**
```js
// Setting multiples paths
gesco.set({
    'foo': 'bar',
    'bar': 'foo'
});
```


----------


##### **gesco.observe(path, observer)**
```js
// Adding an observer to watch "user.name" changes

gesco.observe('user.name', function (newName) {
    console.log('the user has changed his name to', newName);
});
```

```js
// Adding multiples observers to watch "user.name" changes

var observerOne = function (newName) {
    console.log('the user has changed his name to', newName);
};
var observerTwo = function (newName) {
    console.log('his new name -', newName, '- is cool!');
}

gesco.observe('user.name', [observerOne, observerTwo]);
```


----------


##### **gesco.compute(path, computer)**
```js
// Adding a computer to watch and preprocess data

gesco.compute('user.name', function (name) {
    // Capitalizing
    return name.replace(/\b\w/g, x => x.toUpperCase());
});
```

##### **gesco.compute(toPath, fromPath, computer)**
```js
// Adding a computer to watch a specific path (fromPath) and its result is stored as another path (toPath)

gesco.compute('user.nameWithoutSpaces', 'user.name', function (name) {
    return name.replace(/\s/g, '');
});
```


----------


##### **gesco.emit(path)**
```js
// Pushing item to array (without side-effects), then emitting changes to observers
var friends = gesco.get('user.friends');
friends.push('John Troe');

gesco.emit('user.friends');

// Setting sub-property (without side-effects), then emitting changes to observers
var user = gesco.get('user');
user.name = 'John Doe';

gesco.emit('user');

// Emitting multiples changes
gesco.emit(['foo', 'bar']);
```

##### **gesco.emit(path, callback)**
```js
// Executing callback, then emitting changes to observers synchronously

gesco.emit('user.friends', function (friends) {
    friends.push('John Troe');
});
```

##### **gesco.emit(path, callback, excludeComputerFn, excludeObserverFn)**
```js
// Executing callback, then emitting changes to observers synchronously

// The path 'friendsLengt' will not be affected by change
var excludeComputerFn = function (computer) {
    return computer.to === 'friendsLength';
}

// The path 'user.friends' will not be affected by change
var excludeObserverFn = function (observer) {
    return observer.from === 'user.friends';
}

gesco.emit('user.friends', function (friends) {
    friends.push('John Troe');
}, excludeComputerFn, excludeObserverFn);
```

----------


##### **gesco.link(toPath, fromPath)**
```js
// Linking an path to another path (one-way)
gesco.link('userName', 'user.name');

// Equivalent to...
gesco.compute('userName', 'user.name', function (value) {
    return value;
});
```

##### **gesco.link(batch)**
```js
gesco.link({
    // fromPath  // toPath
    'user.name': 'userName',
    'user.name': ['userName1', 'userName2'],
});

```

----------


##### **gesco.delete(path)**
```js
// Deleting an path
gesco.delete('user.name');

// Deleting multiples paths
gesco.delete(['foo', 'bar', 'foobar']);
```


----------


##### **gesco.toString()**
```js
// Returning data processed by JSON.stringify
gesco.toString();
```

## Path

It can be array or strings (using **dots**)
```js
gesco.get(['user', 'name']);

gesco.get('user.name');
```

## License

MIT. Copyright (c) 2017 Isaac Ferreira (zaclummys)
