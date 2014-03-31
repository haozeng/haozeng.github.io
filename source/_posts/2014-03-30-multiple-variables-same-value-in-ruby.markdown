---
layout: post
title: "Create multiple varariables with differentreferences in ruby"
date: 2013-01-30 20:25:50 -0700
comments: true
categories:
---

Today I had a bug in ruby which I do not quite understand, and it turned out to be reference issue in ruby.

First, I tried something like this and intended to create 4 variables for the same values, but different objects

```ruby

a, b, c ,d = [Object.new] * 4

```
This turns out to be a, b, c, d refers to the same object

```ruby
a.object_id == b.object_id
#=> true
```
So the correct way should be:

```ruby
a, b, c, d = Object.new, Object.new, Object.new, Object.new
```
