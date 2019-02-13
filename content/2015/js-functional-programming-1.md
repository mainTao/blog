---
title: JS 函数式编程（1）
date: 2015-11-07 07:00:00
layout: post
style: code
tags:
---

要是在两三年前，我会说，函数式编程还没真正火起来。可现在，我只能遗憾地说，函数式编程终究没有火起来。

倒不是说函数式编程不好，而是对大多数程序员而言，尤其是习惯了面向过程、面向对象的程序员，函数式编程确实有些曲高和寡。

虽然像 Lisp、Haskell、Clojure、Erlang 这样的函数式编程语言没能广泛流行起来，但函数式编程的思想逐渐被一部分语言重视并借鉴，例如风头正劲的 JavaScript。

本文将作为一个系列的开篇，从基础知识开始，一步一步地介绍 JavaScript 函数式编程。

## 纯函数

纯函数是这样一种函数：对于同样的输入必会有相同的输出，无论何时，无论何地。

纯函数的唯一输入就是函数参数，唯一的输出就是返回值。纯函数的入参都是值传递，而非引用传递，因此它无法改变外部变量的值。

举一个典型的例子：

slice 是纯函数。splice 就不是纯函数，因为它会切断入参数组。

```javascript
var a = [1, 2, 3];

a.slice(0, 1);
console.log(a); // => [1, 2, 3]

a.splice(0, 1);
console.log(a); // => [2, 3]
```

## 纯函数的好处

面向对象想必大家都很熟悉了。它符合人的常规思维，又好理解又好用，但是 Erlang 语言的作者 Joe Armstrong 说：
 
 > 面向对象语言的问题是，它们永远都要随身携带那些隐式的环境。你只需要一个香蕉，但却得到一个拿着香蕉的大猩猩...以及整个丛林。

纯函数有哪些好处呢？

1. 因为相同输入的输出是确定的，于是可以放心做缓存。入参序列化后得到一个字符串，当做字典的 key，如果 key 在缓存字典中能找到，value 必然和上一次计算结果相同，就不用再计算一遍了。

2. 可移植性。因为不依赖状态，就能够序列化后放心地传递到其他线程、进程或者其他主机。比如可以将数据和函数传给 web worker 而不必担心它还要引用主线程的什么东西。

3. 测试简单。因为不依赖上下文和状态，只要关注入参和返回值，执行顺序什么的都不用考虑，写测试用例再也不需要顾虑重重了。

4. 并行简单。不共享内存、不用锁，对并行来说各种福利啊。


## 闭包

闭包的概念，我没有找到特别好的解释，不如通过代码来理解。

```javascript
function f1() {
    var n = 0;
    function f2() {
      console.log(n++); 
    }
    return f2;
}
```

以上代码中，函数 f2 就是闭包，它可以读写它外部的函数 f1 中定义的变量，并且保留这个变量在内存中不被释放。

```javascript
var func = f1();
func();  // => 0
func();  // => 1
func();  // => 2
func();  // => 3
```

上面这段代码中，每次调用 func（即f2) 都会让 n 增加 1，并且保留 n 改变后的值。

因为 n 定义在 f1 内部，从外面无法访问到，所以除非用闭包，否则无法访问到 n。

JavaScript 代码中，经常会看到结合了 IIFE(Immediately Invoked Function Expression) 和闭包两个特性来实现“私有变量”。例如下面两端代码，除了通过闭包再无方法访问 n 的值。

```javascript
var counter = (function () {
    var n = 0;
    return function() {
      console.log(n++); 
    }
})();

counter(); // => 0
counter(); // => 1
counter(); // => 2
```

```javascript
var obj = (function () {
  var n = 0;
  return {
    get: function () {
      return n;
    },
    set: function (value) {
      n = value;
    }
  }
})();

console.log(obj.get()); // => 0
obj.set(1000);
console.log(obj.get()); // => 1000
```


JavaScript 函数式编程，使用闭包是很重要的一个技巧，务必熟练掌握。

下面再看两个可爱的小栗子：

```javascript
// Example 1
function makeAdder(increment){
  return function (n) {
    return n + increment;
  }
}

var add10 = makeAdder(10);
var add1000 = makeAdder(1000);

console.log(add10(1)); // 11
console.log(add1000(1)); // 1001
```

这个例子中 makeAdder 函数返回值是一个函数，于是我们用函数生成了两个函数，这两个函数做了相似但不同的事情，一个加 10，一个加 1000。值得注意的是，这过程中只有函数的调用，并没有定义中间变量，是闭包帮我们保存了中间变量。


```javascript
// Example 2
function say(word){
  return function (someone) {
    return function (method){
      return 'say ' + method(word) + ' to ' + someone;
    }
  }
}

var sayHelloTo = say('hello');

var sayHelloToHaskell = sayHelloTo('Haskell');
var sayHelloToCurry   = sayHelloTo('Curry');

function loud (word){
  return word.toUpperCase();
}
function inLowVoice (word){
  return word.split('').join('~');
}

var sayHelloToHaskellLoudly     = sayHelloToHaskell(loud);
var sayHelloToHaskellInLowVoice = sayHelloToHaskell(inLowVoice);
var sayHelloToCurryLoudly       = sayHelloToCurry(loud);
var sayHelloToCurryInLowVoice   = sayHelloToCurry(inLowVoice);

console.log(sayHelloToHaskellLoudly);     // => say HELLO to Haskell
console.log(sayHelloToHaskellInLowVoice); // => say h~e~l~l~o to Haskell
console.log(sayHelloToCurryLoudly);       // => say HELLO to Curry
console.log(sayHelloToCurryInLowVoice);   // => say h~e~l~l~o to Curry

console.log(say('hello')('me')(loud));    // => say HELLO to me

```

这颗栗子稍微大了一点，不仅演示了把函数作为返回值，也演示了把函数作为参数的用法。其中 loud 和 inLowVoice 这两个函数就被当做参数使用了。

代码实现的功能本身很无聊，但意思表达清楚了：就是通过不断传入参数返回新函数的方法，一步步将简单的函数变复杂、变具体，变得携带业务逻辑。整个过程中无需定义变量来保存状态。

注意最后一行代码，是函数连续调用，前一个函数返回的值是个函数，于是接着调用这个函数，返回又一个函数，直到最终结果出来。

通过上面的例子，还无法展现函数式编程的优势。先找找感觉，精彩的还在后面。
