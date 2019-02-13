---
title: JS 函数式编程（2）
date: 2015-11-14 07:00:00
layout: post
style: code
tags:
---

本文将接着为 JavaScript 函数式编程打基础。

## this

this 是 JavaScript 里最别扭、最让人迷惑的关键字。相信有其他面向对象语言经验的人，看到 JavaScript 里 this 的各种问题都会骂脏话。

但是用 JavaScript 你就避不开它。下面科普一下 this 在 JavaScript 中的用法。

this 只在函数内部用，在函数执行时 this 指向一个对象（把这个对象叫做 context）。若没有 context，this 指向全局对象（浏览器里是 window，在 Node.js 里是 global）。下面分别说明：

### 没有指定 context，即 context 是全局对象
```javascript
function f(){
    console.log(this);
}
f(); // this 指向 window 或者 global
```

### context 是一般对象的情况
```javascript
function f(){
    console.log(this);
}
var obj = {};
obj.fn = f;
obj.fn(); // => obj
```

### 用于构造函数内部（面向对象写法）
```javascript
function Animal(type){
  this.type = type;
  console.log(this);
}
var cat = new Animal('cat');  // => Animal { type: 'cat' }
```

### 使用 call 或 apply 动态改变 context

call 和 apply 是函数类型 prototype 上内置的两个方法：

    Function.prototype.call(this, arg1, arg2)
    Function.prototype.apply(this, [arg1, arg2])
    
先看 call 函数动态改变 this 的一个简单例子：

```javascript
function printThis(){
    console.log(this);
}
printThis(); // => window
printThis.call('dynamic'); // => 字符串 dynamic
```

call 和原函数传的参数一样，apply 则用来应付参数数量不定的情况，一个很经典的例子是对内置的 Math.max 函数的使用。
    
```javascript
    Math.max(1, 2, 3); // 3
    Math.max([1, 2, 3]); // NaN
    Math.max.apply(null, [1, 2, 3]); // 3
```

上面代码中，令 Math.max 函数在运行时 this 指向 null，一般用不到 this 时就这么写。


### 锁定 this

this 指向谁在执行时才能确定，这会带来很多困扰，有时候我们需要绑定 this 以求安心。最常见的绑定的用法，是让一个对象内部定义的函数中的 this 指向这个对象本身。下面先看看绑定是怎么实现的，再看如何使用绑定。

```javascript
function bind(obj, functionName) {
    var original = obj[functionName];
    obj[functionName] = function() {
        return original.apply(obj, Array.prototype.slice.call(arguments));
    };
}

var obj = {
    name: 'obj',
    func: function () {
        console.log(this.name);
    }
}
var another = {
    name: 'another'
};

another.func = obj.func;
another.func(); // => another
bind(obj, 'func'); // bind 后 func 是一个新的函数
another.func = obj.func; // 所以要再赋值一次
another.func(); // => obj
```
最开始是 bind 函数的实现，它把内部函数的 this 强行指向 obj，实现了对 this 的锁定。注意，bind 函数里用闭包保存了函数原来的值 original。

underscore 和 loadash 里有 [_.bind](http://underscorejs.org/#bind) 和 [_.bindAll](http://underscorejs.org/#bindAll) 函数实现了这样的功能，用起来很方便。


## 递归和尾递归

递归是一位多年不见的老相识。很早就知道递归，只不过工作中极少用到，就算能用到也不敢用。

为什么？一是担心性能差，二是担心栈溢出。

这两个问题的根源在于，每往里调用一层都要往 call stack 里加入一个新的 stack frame，这有一定的代价，而且若 stack frame 太多超出了栈的容量，会引发栈溢出（stack overflow）。

那什么是尾递归呢？简单说就是函数的最后一步是单纯地调用自身。例如下面两个例子，它们在调用完函数后立即就返回了：

```javascript
function f (x) {
    return f (x + 1) ;
}

function g (x) {
    if(x < 99999){
        return g(x + 1);
    }
    return x;
}
```

尾递归优化可避免栈溢出，因为在调用完自身后，之后不需要再做其他事情，也就不需要在进入下一层调用时保存上一层的上下文（stack frame），也就永远不会 stack overflow。

但下面这些就不是尾递归，它们在调用完函数后还有别的操作：
```javascript
function f (x) {
    var ret = f (x + 1) ;
    return ret;
}
```

下面这个也不是，因为它在调用完自身后又做了一步加法运算：
```javascript
function sum(x) {
  if (x === 1) {
    return 1;
  }
  return x + sum(x - 1);
}
```

我们把它改成尾递归：
```javascript
function sumTail(x, total) {
  if (x === 1) {
    return x + total;
  }
  return sumTail(x - 1, x + total);
}

sumTail(100, 0); //  1 + 2 + ... + 100 = 5050
```

通过加了一个 total 参数，改成了尾递归。但多了一个参数写起来有些别扭，于是封装一下：

```javascript
function sum (x) {
    function sumTail(x, total) {
      if (x === 1) {
        return x + total;
      }
      return sumTail(x - 1, x + total);
    };
    return sumTail(x, 0);
}

sum(100); // 5050
```
代码写成尾递归，不代表就一定能享受尾递归优化的福利。因为尾递归优化是需要语言本身支持的。尽管尾调用优化（尾递归是伪调用的一种）写进了 ECMAScript 6 的标准，然而不幸的是，目前所有的浏览器以及最新的 Node.js 均不支持尾调用优化。所以从工程角度看，我们仍然无法愉快地使用递归。希望 ES6 标准尽快普及吧。
