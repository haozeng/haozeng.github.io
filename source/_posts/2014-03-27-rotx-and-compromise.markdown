---
layout: post
title: "rotx and compromise"
date: 2014-03-27 20:36:18 -0700
comments: true
categories: [ruby, javascript]
---

Rotx exercise:

``` ruby
def rotx(x, string, encrypt=true)
  letters = ('a'..'z').to_a

  string.split('').map! do |letter|
    if letter.match(/[a-zA-Z]/)
      # Looking for index
      index = letter == letter.downcase ? letters.index(letter) : letters.index(letter.downcase)

      # Building rotated index either by moving forward or backward
      rotated_index = encrypt ? (index + x)%26 : (index - x)%26

      # Building new letter based on rotated index
      letter == letter.downcase ? letters[rotated_index] : letters[rotated_index].upcase
    else
      letter
    end
  end.join
end

describe 'Test #rotx' do
  it 'should rotate the string and encrypt as default' do
    rotx(10, 'Hello, World').should eql 'Rovvy, Gybvn'
  end

  it 'should rotate back the string if encrypt is false' do
    rotx(10, 'Rovvy, Gybvn', false).should eql 'Hello, World'
  end

  it 'should return the same results if roration number is added 26' do
    rotx(36, 'Hello, World').should eql 'Rovvy, Gybvn'
  end
end

```

A simple compromise implementation, and this will build the foundation in removing callbacks in node.js app.

``` javascript
Promise = function () {
  this.value;
  this.callbacks = [];
};

Promise.prototype.resolve = function(result) {
  if (this.value) {
    throw new Error('A promise should only be able to be resolved once !');
  } else {
    this.value = result;
  }
  if (this.callbacks.length > 0) {
    this.triggerCallbacks();
  }
};

Promise.prototype.success = function(fn) {
  this.callbacks.push(fn);

  if (this.value) {
    this.triggerCallbacks();
  }
};

Promise.prototype.triggerCallbacks = function() {
  var self = this;

  this.callbacks.forEach(function(callback) {
    callback.call(self,self.value);
  });
}

var foo = new Promise();
var bar = new Promise();

foo.resolve('hello');

setTimeout(function(){
  bar.resolve('world');
}, 500);

foo.success(function(result){
  console.log(result);
});

bar.success(function(result){
  console.log(result);
});

// Throw errors if one promise tries to resolve twice

var foobar = new Promise();
foobar.resolve('hello');
foobar.resolve('world');
```
