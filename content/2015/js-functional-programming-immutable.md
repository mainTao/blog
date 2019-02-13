---
title: JS 函数式编程 - Immutable
date: 2015-12-07 07:00:00
layout: post
style: code
tags:
---

## Mutable VS Immutable

程序员讨厌不确定性。

假设有这么一个对象 obj，它有很多属性，其中某些属性自身又是对象，又包含了其他属性，情况就比较复杂了。当把 obj 传给一个函数 f，如果 f 要修改 obj 的属性，拦也拦不住。那么在调用 f(obj) 之后，obj 的某个属性也许就发生了变化，再次调用 f(obj) 也许将得到不一样的结果。这就是所谓的副作用。 

人发生了变异，叫做 mutant
![](/img/2015/js-functional-programming-immutable_leela.png)

青春期的乌龟发生了变异，叫做 Teenage Mutant Nijia Turtle
![](/img/2015/js-functional-programming-immutable_tmnt.jpg)

数据在创建后发生变异，那可了不得，叫做 mutable，不可改变则是 immutable！（真牛逼，有没有点儿 immortal 的感觉）

Immutable 的好处有哪些？这个问题的答案几乎等同于函数式编程的好处有哪些。再多提一点吧，有了 immutable 就很容易做 undo / redo 这样的操作，只要把历史对象存下来就很容易回溯。

## Immutable.js

![](/img/2015/js-functional-programming-immutable_immutablejs.png)

Facebook 出品的 [Immutable.js](https://github.com/facebook/immutable-js) 目前已经获得了超过一万个 star。

JS 语言的对象是 mutable 的，immutable.js 的使命便是为 JS 带来 immutable 的数据结构。包含以下七种：

1. List
2. Stack
3. Map
4. OrderedMap
5. Set
6. OrderedSet
7. Record

具体用法就不赘述了，请撸[文档](http://facebook.github.io/immutable-js/)。在此只举一个最简单的例子：

```javascript
var Immutable = require('immutable');

var map1 = Immutable.Map({a:1, b:2, c:3});
var map2 = map1.set('b', 50);

console.log(map1.get('b')); // => 2
console.log(map2.get('b')); // => 50
console.log(map1 === map2); // => false
```

map2 由 map1 调用 set 创建出来的，创建的同时改动了 b 这个属性，注意是 map2 新建了一个自己的 b，而不是在 map1 的 b 上改动。在这之后，map1 和 map2 指向了不同的引用，而且它们都是不可变的。  

那位说了，想在 JS 里实现 immutable 不难啊，只要在每次修改之前做一份深拷贝（例如用 lodash 提供的 cloneDeep），在这份拷贝上进行修改而不改动原先的对象，然后返回这个修改过的深拷贝不就行了吗？

我竟无法反驳~

行是行，但效率太低了。你想啊，一个 DOM 节点动辄上百个属性嵌套一大堆子节点，深拷贝的代价太大。Immutable.js 用一种巧妙的办法来减小性能损耗：只克隆被修改节点以及它所有的祖先节点，看下面动图：

![](/img/2015/js-functional-programming-immutable_tree.gif)

以上图为例，若做整棵树的深拷贝，要拷贝 10 个节点，优化后则只需要拷贝 4 个节点。之所以能共享了一些节点，是因为当发生改变的时候，谁都不会去改动原有的树，从而保障已共享的树长期稳定。

我们再拿一个小例子验证一下上面的图：
```javascript
var Immutable = require('immutable');

var map1 = Immutable.Map({a:1, b:2, c:3});
var map2 = map1.set('b', 2); // same value

console.log(map1 === map2); // => true
```

给 map2 的 b 属性设置的新值和 map1 原先的值一样，于是没有变化，就没克隆新的节点，所以 map1 和 map2 指向同一个对象。

再来一个例子：

```javascript
var Immutable = require('immutable');

var map1 = Immutable.Map({a:1, b:2, c:3});
var map2 = map1.set('b', 50);
var map3 = map2.set('b', 2); // same as map1

console.log(map1 === map2); // => false
console.log(map1 === map3); // => false
console.log(map1.equals(map3)); // => true
```

为啥 map3 的值和 map1 一模一样（用 equals 判断内容相等）但却没有指向相同的对象呢？因为 map3 是由 map2 构造而来，在创建 map3 的时候只能和 map2 去比较，不相等，则只好另创建一个新的对象，这个新的对象和已经存在的 map1 不是同一个。
