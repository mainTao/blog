---
title: JS 函数式编程 - Currying
date: 2015-11-21 07:00:00
layout: post
style: code
tags:
---

## 咖喱？

咖你个头！Currying（柯里化） 一词来自函数式编程的祖师爷 Haskell Curry，是不是很眼熟？著名的函数式编程语言 Haskell 也是以他老人家命名的。

Curry 是个动词，柯里化，英文资料里 curring、curried 就不用我说什么意思了。

## What is curry

什么是柯里化呢？

柯里化就是把一个原本多参数的函数进行改造，改造后能够以单参数的形式连续调用，每次只传进去一个参数，函数的功能就变明确一些，直到最终完成原函数的逻辑。

看下面代码和图示更容易理解：

```javascript
function curry (fun) {
  return function (c) {
    return function (b) {
      return function (a) {
        return fun(a, b, c);
      }
    }
  }
}

var concat = function (a, b, c) {
  return a + ' ' + b + ' ' + c;
};

var str = curry(concat)('apple')('like')('I');
console.log(str); // => I like apple
```

![](/img/2015/functional-programming_currying.png)


## curry left or curry right

还是用代码来解释 curry left 和 curry right：

```javascript

function f (a, b, c) {}

curried(a)(b)(c); // curry left, 与原函数传参顺序相同
curried(c)(b)(a); // curry right, 与原函数传参顺序相反

```

上面示例中我们写的函数 curry 实际上是 curryRight，下面来对比一下 curryLeft 和 curryRight 两种写法：

```javascript
function curryLeft (fun) {
  return function (a) {
    return function (b) {
      return function (c) {
        return fun(a, b, c);
      }
    }
  }
}
var str = curryLeft(concat)('I')('like')('apple');
console.log(str); // => I like apple

// 
function curryRight (fun) {
  return function (c) {
    return function (b) {
      return function (a) {
        return fun(a, b, c);
      }
    }
  }
}
var str = curryRight(concat)('apple')('like')('I');
console.log(str); // => I like apple
```

curryLeft 和 curryRight 传递参数的顺序不一样，用哪个好呢？要具体情况具体对待。柯里化的目的就是制造一些可以被复用的中间函数，因此要让相对固定的参数率先传进来，得到可复用的中间函数，而让易变化的参数最后传进来，完成最终的调用。

## curry in lodash

lodash 库里有现成的 [curry 函数（表示 curryLeft）](https://lodash.com/docs#curry)，以及[curryRight 函数](https://lodash.com/docs#curryRight)。用一个例子来说明这两个函数的用法，以及什么时候该用哪种：

```javascript
var concat = _.curry(function (a, b, c) {
  return a + ' ' + b + ' ' + c;
});

var youLike = concat('you')('like');
youLike('apple');  // you like apple
youLike('orange'); // you like orange

var divide = _.curryRight(function (n, d) {
  return n / d;
});

var divideBy3 = divide(3);
divideBy3(21);_// 7
divideBy3(27);_// 9
```

第一个例子中，like 的宾语是易变的，即原函数中右边的参数易变，所以使用 curry left。
第二个例子中，我们希望被除数是易变的，即原函数中左边的参数易变，所以使用 curry right。

lodash 的柯里化不强制每次只传入一个参数，而是允许传入多个参数，这带来了使用上的灵活性。看例子：

```javascript
var concat = _.curry(function (a, b, c) {
  return a + ' ' + b + ' ' + c;
});

concat('you')('like')('apple');
concat('you', 'like')('apple');
concat('you')('like', 'apple');
concat('you', 'like', 'apple');

```

## Why curry

柯里化的目的，是让函数的参数变成单个，于是函数就变成只有一个输入参数和一个返回值。那这样做的意义又是什么呢？我觉得有以下两点：

第一个意义，是方便创建中间函数。先指定某些参数，得到有明确意义的、值得复用的函数，看个例子：

```javascript
var match = _.curry(function (regex, str) {
  return !!str.match(regex); // 用 !! 转换成布尔类型
});

// 创建中间函数
var hasSpace = match(/\s+/);
var hasHaskell = match(/haskell/i);

hasSpace('MyGod'); // false
hasSpace('My God'); // true
hasHaskell('Hello Haskell'); // true
hasHaskell('Hello Mr. Curry'); // false
```

第二个意义，是都变成一个入参后，给多个函数配合上带来了方便，这点我们将在下一篇中详述。
