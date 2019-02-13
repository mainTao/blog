---
title: JS 函数式编程 - Flow style
date: 2015-11-28 07:00:00
layout: post
style: code
tags:
---

严肃的函数式编程教程，会把它所有的概念逐个讲一遍。这一过程中，不可避免地要硬磕很多概念，比如这货：

## Monad? what the hell

我搜索什么是 Monad，知乎上得票最高的答案是这样的：

> 两篇paper就够了，先看Philip Wadler 的 Monads for functional programming，这篇更详细，然后看他的 The essence of functional programming，后者提到了 Monad 和 CPS 之间的关系。然后你还得写。。写几个用 Monad 的 parser/interpreter 就熟悉了。Wadler 的文章当然比网上满天飞的 Monad 教程靠谱得多。。话说我上 Erik Meijer 的 Haskell 公开课时，Functional parser 那一节做练习前要签的 EULA 就是“我保证，不再在网上又发布一篇 Monad 教程”23333

还搜到一篇写的不错的文章，其中一段解释是这样的：

> Monad 之所以难以理解，就在于它的抽象性。这不同于面向对象，鹰是一种鸟这种程度的类比就足以让人理解子类父类继承关系这些概念了。Monad 的抽象是形而上的高度抽象。它本身是抽象代数中范畴学的一个概念，是特殊的算子。要真正消化它首先要理解抽象的对象，类型，范畴，函子这些概念。没有这些概念打底，理解 Monad 可谓是空中楼阁无根之木。


## 脚踏实地

开始学习 JS 函数式编程之后，感觉到有点进退两难。因为时间主要用来死磕概念，而没有学到实用的技能。于是打退堂鼓，要不要继续看下去？值不值得？

说实话，要不是在博客上开始了这个系列，我也许早就弃了。还是善始善终吧，弃了怪丢人的。函数式编程的概念我就不多讲了，还是瞅瞅这里头有什么实用的技能可以 get。

## Flow Style Programming

首先我们来看一个特别重要、也特别难懂的概念——「流式编程」。

===== 前方高能，请准备好足够的脑细胞 =====

什么是「流式编程」？告诉你们吧，是我瞎起的名字。凡是代码写起来或读起来我觉得有行云流水的感觉，就是 flow style！怎么样是不是想关网页了？赶紧关。

每当看到一连串流畅的小配合，我就舒服。比如看阿森纳传球，比如 Unix 的管道，比如 jQuery、underscore 以及 promise 的链式调用。

流式写法在函数式编程中也很常见，柯里化后的函数调用 f(a)(b)(c) 看着酷酷的。


## 滚蛋吧，中间变量！

程序员最头疼的是什么？命名！

写代码的时候，起的名字总是很难让自己满意，又影响心情又降低效率。如果能省掉中间变量，至少写的时候会爽很多。

但这也是一把双刃剑，因为缺少中间变量，也就少了一个可以查看的值，调试时经常需要查看某个变量中间状态，如果没定义这个变量，显然就无法观测到。

另外在程序出错的时候，一搬告诉你在哪一行出的问题，但由于函数式写法经常将多个函数调用写在一行里，就比较难排查。

```javascript
f(g(x)); // 若这一行出错了，不知道是 g 还是 f
f(a)(b)(c); // 若这一行出错了，不知道是哪一步出的错
```

## compose

上面的例子里，f(g(x)) 就是 compose。像这样的组合在函数式编程里太常见了，所以 underscore 和 lodash 里分别有对应的方法。

underscore 里叫做 _.compose：
```javascript
var greet    = function(name){ return "hi: " + name; };
var exclaim  = function(statement){ return statement.toUpperCase() + "!"; };
var welcome = _.compose(greet, exclaim);
welcome('steve'); // -> 'hi: STEVE!'
```

lodash 里用法完全一样，只不过名字换成了 _.flow 和 _.flowRight（看来不光我一个人想到了流式编程这个词）
```javascript
function add (x, y) {
  return x + y;
}

function square (x) {
  return x * x;
}

var addAndSquare = _.flow(add, square);
addAndSquare(1, 2); // -> 9

var addAndSquare = _.flowRight(square, add);
addAndSquare(1, 2); // -> 9
```
注意，_.compose 和 _.flowRight 的参数是一样的，即从最右边的函数开始执行，而 _.flow 是从最左边的函数开始执行。用哪一种完全看个人喜好了，flow 视觉上更像我们熟悉的管道，而 flowRight 更有函数式的范儿。

## 各种“流”派

流不是没有代价，要保证每一步能前后衔接，就要把管道对接好。JS 里的流式写法常见于以下几个场合：

### (1) jQuery 链式调用
```javascript
$('.list').find('.item.active').removeClass('active');
```
jQuery 对象的绝大部分方法的返回值即是这个 jQuery 对象本身，于是可以在其之上接着调用 jQuery 方法。

### (2) _.chain
```javascript
var users = [
  { 'user': 'barney',  'age': 36 },
  { 'user': 'fred',    'age': 40 },
  { 'user': 'pebbles', 'age': 1 }
];

var youngest = _.chain(users)
  .sortBy('age')
  .map(function(chr) {
    return chr.user + ' is ' + chr.age;
  })
  .first()
  .value();
// -> 'pebbles is 1'
```
chain 方法在 underscore 和 lodash 里都有，不过用起来稍微有点繁琐。必须先用 _.chain 包裹成一个对象，然后才可以链式调用，最后取结果还要调用 value() 来解开包裹。


### (3) promise 
Promise 在 JS 里早已经无所不在了，无论前端后端都在大量使用，就不再赘述了。

这里稍作总结，以上三种：jQuery，_， promise，之所以能链式调用，都因为遵循了一个原则：返回特定类型的对象。例如 jQuery 对象的方法返回 jQuery 对象，underscore 对象的方法返回 underscore 对象，Promise 的方法（例如 then）返回 promise 类型的对象。

### (4) compose
compose 遵循的原则是：上一个函数的返回值作为下一个函数的入参。它不要求返回值必须是某一类型的对象，相对要灵活一些。

可以这么理解，compose 把一个个函数拼接成一条管道，而每一个函数就是其中一截管道，每一截管道不要求入口（入参）和出口（出参）的规格一致，只要和前后的管道衔接好即可。使用 compose 最常遇到的问题也正在于与前后的管道衔接不好，比如下一节管道需要一个字符串类型的入参，而你传了一个列表进去，就必然遇到 broken pipe 错误了（玩笑，broken pipe 是 Unix 系统常见的一种错误，和本文的主题无关）。

当组合的函数一多，难免会出现衔接上的问题，于是我们需要快速甄别在哪个环节出的问题。这里介绍一个用于调试的小技巧，看下面这段 Node.js 代码：


```javascript
var _ = require('lodash');

function replace (regex, replacer) {
  return function (str) {
    return str.replace(regex, replacer)
  }
}

function split (separator) {
  return function (str) {
    return str.split(separator);
  }
}

function lowerCase (str) {
  return str.toLowerCase();
}

function join (separator) {
  return function (str) {
    return str.join(separator);
  }
}

var dasherize = _.flow(
  replace(/\s+/g, ' '),
  split(' '),
  lowerCase,
  join('-')
);

ret = dasherize('Hello My Friend');
console.log(ret);

```

dasherize 是我们自造的单词，意思是把原先空格分隔单词的字符串变成 dash 分隔的并且都是小写的字符串。但是上面这段程序会报错，显然是某一截管道对接出了问题。

为了排查这个错误，我们加入一个 trace 函数，并插入到 dasherize 中以方便定位错误：

```javascript
function trace (traceInfo) {
  return function (x) {
    console.log(traceInfo);
    console.log(x);
    console.log('------------------');
    return x;
  }
}

var dasherize = _.flow(
  replace(/\s+/g, ' '),
  trace(1),
  split(' '),
  trace(2),
  lowerCase,
  trace(3),
  join('-')
);
```

trace 函数只是打印一行调试信息，以及入参的值，然后将入参原样透传出去。再运行，发现日志里打出了 1 和 2，却没有 3，显然是 3 的上一步 lowerCase 出了问题。哦~原来 split 函数的返回值是数组，而 lowerCase 把它当字符串来处理了。我们加入一个 map 函数来搞定它。

```javascript
function map (func) {
  return function (list) {
    return _.map(list, func);
  }
}

var dasherize = _.flow(
  replace(/\s+/g, ' '),
  trace(1),
  split(' '),
  trace(2),
  map(lowerCase),
  trace(3),
  join('-')
);

```

搞定！得到了我们要的 hello-my-friend。这个例子并非算法最优，是为了演示函数式编程而写。从中能看出前一篇讲的柯里化的用法，为了拼接管道，我们需要函数只有一个入参，因为函数的返回值只能有一个。关于函数式编程的一些概念，初学时往往不能理解其用意，需要在不断的练习中慢慢体会。

上面的例子中，replace, split, lowerCase, join, map 这几个函数在定义的时候都柯里化了，为的就是后面能配合。但现实情况是，很多已经写好的函数并没有柯里化，我们如何复用这些函数呢？用 lodash 的 _.curry 方法！让我们重写上面的例子：

```javascript
var _ = require('lodash');

function replace (regex, replacer, str) {
  return str.replace(regex, replacer);
}

function split (separator, str) {
  return str.split(separator);
}

function lowerCase (str) {
  return str.toLowerCase();
}

function join (separator, str) {
  return str.join(separator);
}

function map (func, list) {
  return _.map(list, func);
}

var dasherize = _.flow(
  _.curry(replace)(/\s+/g, ' '),
  _.curry(split)(' '),
  _.curry(map)(lowerCase),
  _.curry(join)('-')
);

var ret = dasherize('Hello my friend');
console.log(ret);
```

从以上代码可以看到，所有的函数都没有在定义时柯里化，但他们都遵循了另外一个原则：把要处理的数据作为最后一个参数。
    
    replace (regex, replacer, str)
    map (func, list)
   
replace 函数的参数 str 是最后要处理的字符串，map 函数的参数 list 是要处理的数组，它们都位于参数列表的最后。这样才方便在柯里化之后把它的位置留出来用于传递。如果有个别函数的这个参数位于参数列表的开头，用 _.curryRight 也搞得定。但这样就会比较烧脑，所以不管你选 left 还是 right，应尽量统一，不要混着用。

## 适度地使用 flow style

怎样，使用 flow 进行流式编程很爽吧，但也要适度，流就像不停球一脚出球，技术很好的球队经常打出连续一脚传球的配合，但是也不会连续太多，否则很容易玩砸。编程也是一样，适当的停一下球（使用中间变量），有助于更好地控制节奏。

最后看一个相对实用的例子，它把 HTML 标签的 className 由 camelCase 或下划线连词风格统一成了 dash 连词风格。
 
```javascript
var _ = require('lodash');
var list = [
  'btnPrimary',
  'add_to_cart'
];

function replace (regex, replacer, str) {
  return str.replace(regex, replacer);
}

function replaceGroup(regex, func, str) {
  var matches = str.match(regex);
  if(matches){
    matches.forEach(function (match) {
      var replacer = func(match);
      str = str.replace(match, replacer);
    })
  }
  return str;
}

function split (separator, str) {
  return str.split(separator);
}

function lowerCase (str) {
  return str.toLowerCase();
}

function join (separator, str) {
  return str.join(separator);
}

function map (func, list) {
  return _.map(list, func);
}

var dasherize = _.flow(
  _.curry(replaceGroup)(/[A-Z]/g, function (match) {
    return ' ' + match;
  }),
  _.curry(replace)(/_+/g, ' '),
  _.curry(replace)(/\s+/g, '-'),
  lowerCase
);

var translateClassName = _.flow(
  _.curry(map)(dasherize),
  _.curry(join)(' ')
);

var ret = translateClassName(list);
console.log(ret); // => btn-primary add-to-cart

```