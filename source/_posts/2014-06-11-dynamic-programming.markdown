---
layout: post
title: "Subset sum using dynamic programming"
date: 2013-11-11 15:52:36 -0700
comments: true
categories:
---

Problem:
Given a set [1,2,3,4], how many subsets there are in which each sum is equal to 4 ?

Solution:
Solution is programmed using ruby in dynamic programming.
The idea is set up a matrix in which each cell in x axis represents a number in set.
And in y axis, each cell represent their corresponding sum.

For example, in this case, 1,2,3,4 will be numbered in x axis and 1,2,3,4 (incrementally)
will be numbered in y axis.

Then we set up boudary condtions. The algorithm solves problems in multiple subproblems and each subproblem memoize the optimal solution from the previous iteration.

For furthur detailed algorithm, visit [Dynamic Programming](http://en.wikipedia.org/wiki/Dynamic_programming "Dynamic Programming")


```ruby
require 'pry'
require 'pp'
require 'matrix'

def dynamic_programming(set, n, sum)
  matrix = []
  (sum+1).times { matrix << Array.new(n+1, 0) }

  for j in 0..n
    matrix[0][j] = 0
  end

  for i in 0..sum
    matrix[i][0] = 0
  end

  for i in 1..n
    for j in 1..sum
      if j < set[i-1]
        matrix[j][i] = matrix[j][i-1]
      else
        matrix[j][i] = [matrix[j][i-1], set[i-1] + matrix[j-set[i-1]][i-1]].max
      end
    end
  end
  pp matrix
end

set = [1,2,3,4]
sum = 4
n = 4

dynamic_programming(set, n, sum)
```
