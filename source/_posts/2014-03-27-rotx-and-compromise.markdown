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

  var list = [];

  this.success = function(fn) {
    fn.call(this,list[0]);
  };

  this.resolve = function(input) {
    if (list.length === 0)
      {
        list.push(input);
      }
    else
      {
        console.log('error');
      }
  }
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

```
