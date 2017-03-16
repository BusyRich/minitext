# MiniText (alpha)
is an ultra lightweight (< 100 lines) JavaScript text processing helper. It allows you to easily apply a set of regular expression processors or simple tranformations to a block of text.

## Install
Simply download `minitext.min.js` and include it in your project...or create a full custom bundle (see below).

## Usage
The basic usage is to add a processor then apply them to text.

```javascript
minitext.add({
  open: '[face]',
  close: '[/face]'
  render: function(content) {
    return 'Your face is: ' + content;
  }
});

minitext('test\nasfljsaflasjf\n[face]:P[/face]\nadfasdfasdfsad');
//test
//asfljsaflasjf
//Your face is: :P
//adfasdfasdfsad
```

If you leave out `close` it defaults to the end of a line.

```javascript
minitext.add({
  open: '[face]',
  render: function(content) {
    return 'Your face is: ' + content;
  }
});

minitext('test\nasfljsaflasjf\n[face]:P[/face]\nadfasdfasdfsad');
//test
//asfljsaflasjf
//Your face is: :P[/face]
//adfasdfasdfsad
```

Leaving out the `open` defautls to beginning of a line.
```javascript
minitext.add({
  close: '[/face]',
  render: function(content) {
    return 'Your face is: ' + content;
  }
});

minitext('test\nasfljsaflasjf\n[face]:P[/face]\nadfasdfasdfsad');
//test
//asfljsaflasjf
//Your face is: [face]:P
//adfasdfasdfsad
```

Leaving both out will match any line.

```javascript
minitext.add({
  render: function(content) {
    return 'Your face is: ' + content;
  }
});

minitext('test\nasfljsaflasjf\n[face]:P[/face]\nadfasdfasdfsad');
//Your face is: test
//Your face is: asfljsaflasjf
//Your face is: [face]:P[/face]
//Your face is: adfasdfasdfsad
```

You can also provide a custom regular expression, if that is how you roll. Don't forget to provide **a group** for the render content.

```javascript
minitext.add({
  regex: /^(test)$/gm
  render: function(content) {
    return 'Your face is: ' + content;
  }
});

minitext('test\nasfljsaflasjf\n[face]:P[/face]\nadfasdfasdfsad');
//Your face is: test
//asfljsaflasjf
//[face]:P[/face]
//adfasdfasdfsad
```

Of course you can add multiple processors, which are applied in order of addition.

```javascript
minitext.add({
  open: '[face]',
  close: '[/face]'
  render: function(content) {
    return 'Your face is: ' + content;
  }
});

minitext.add({
  regex: /(:P)/g
  render: function(content) {
    return ':)';
  }
});

minitext('test\nasfljsaflasjf\n[face]:P[/face]\nadfasdfasdfsad');
//test
//asfljsaflasjf
//Your face is: :)
//adfasdfasdfsad
```

## USE CAUTION
The nature of MiniText requires a loop to apply all processors to the string. Unfortunately this means there is potentinal to create an infinite loop if a custom regular expression is not properly formatted. Of course testing crucial, but here a few pointers to make sure this doesn't happen.

* make sure you provide a group. Ex: `/(stuff)/`
* make sure to add a quantity modifier to classes. Ex: `/(\d+)/`
* avoid matching simple characters. Ex `/(a)/`
* **NEVER** return content from the render function that would be matched in the regex.

Ex:
```javascript
minitext.add({
  regex: /(test)/g
  render: function() {
    return 'test';
  }
});
// infinite loop :(
```

There is one exception, and that is for expressions that match ALL the text. There is a check that allows you to match the whole string via an expression like `/([\s\S]+)/g`. If an expression matches a string that is the same size as the input, then the loop is broken.


## Custom Bundles
Part of the reason you may want to use MiniText might be chaining various libraries together, combining the output of text processors. This repository is designed to facilitate easily creating custom bundles for your project.

Using [gulp](http://gulpjs.com/) you can build a concatenated, minified collection just by setting up a file structure and running gulp. This process is available by using the following file structure:

```
+ root
| + ext
  | + lib
    | library.js
    ext.js
```

Anything inside `ext/lib` will be included first, and in no particular order, so keep that in mind. Next a minified version of MiniText will be included. Finally, `ext/ext.js` is minified and added. The resulting bundle is ready to use.

`ext/ext.js` can be used for any number of things, but one suggestion is to add any processors you may need, utilizing the including libraries.

## Running Tests
Tests are written in [mocha](http://mochajs.org/). Run them however you see fit.

## Contributing
The idea behind MiniText is to be a lightweight helper. As long as the API is maintained and it stays lightweight, I willing to entertain any improvements. Pull requests welcome.
