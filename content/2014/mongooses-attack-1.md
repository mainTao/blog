---
title: 进击的猫鼬 (1)
date: 2014-10-28 07:00:00
layout: post
style: code
tags:
---

<img class="center" src="/img/2014/mongooses-attack-1-yellow-mongoose.jpg"/>

猫鼬是一种看似温顺，但实际上很厉害的小动物，据说性情凶暴起来足以杀死一条眼镜蛇。在程序员的世界里，猫鼬竟然也占有重要一席。最近接触的两个开源项目，都以mongoose（猫鼬的英文）命名，可见其受喜爱的程度。

这两只猫鼬聪明敏捷，执行任务非常出色，已经是我不可或缺的小伙伴。我打算分两次来介绍一下它们，首先要出场的这只猫鼬，是为使用NodeJS+MongoDB的程序猿准备的。

![](/img/2014/mongooses-attack-1-for-nodejs.png)

[mongoose官网首页](http://mongoosejs.com/)的一句话把mongoose的用途交代的很清楚：

> Let's face it, writing MongoDB validation, casting and business logic boilerplate is a drag. That's why we wrote Mongoose.

说白了mongoose就是一个ORM，如果你要做的东西很简单，就别用mongoose折腾了，推荐使用更加简易的[monk](https://github.com/LearnBoost/monk)。

不过就GitHub上star的数量来说，mongoose是monk十倍有余，流行程度遥遥领先，所以本文就聊一聊这个了不起的mongoose。

mongoose有三个最重要的概念：Schema, Model, instance.

因为Schema和Model用作类型（可理解为class），为了强调这一点，我给Schema和Model的首字母用了大写，instance是对象实例，所以首字母小写。

下面用一个例子串起它们三个的用法。我用关系型数据库的语言描述一下这个例子，先有个了解，以便更有目的性地看代码:

我们数据库里保存的，是菜市场里的菜价信息。有两个表，一个表是markets（菜市场），字段包含市场的名字和地理位置。另一个表是prices（菜价），字段包含某天某种菜在某个市场的价格，其中表示市场的_market字段指向markets表中的某一条记录，可理解为外键。

下面逐块代码进行讲解：

```javascript
var mongoose = require('mongoose');
var events = require('events');

var emitter = new events.EventEmitter();
var Schema = mongoose.Schema;

function handleError(err){
    console.log('error: ', err);
}

mongoose.connect('mongodb://localhost/test');
```

我们的例子由一连串增删改查（CRUD）的操作组成，首先是create，等到create成功以后才进行下一步read，然后才update和delete。由于这些数据库操作都是异步返回的，所以要等前一个操作完成后再进行下一个操作。以上代码中的events，就是为了串行化而引入的。在下面的例子中，由EventEmitter来负责串行化的事件触发。

除了events和emitter这两行，剩下的几乎是使用mongoose所必备的开篇代码，无需多言。


##Schema

MongoDB是document数据库，本质上不对数据格式做限制。但是这不妨碍我们人为地去规范格式，比如我们希望某个collection中的元素都拥有相同的字段和数据类型，单纯而美好的愿望。

Schema就是干这用的。除了限制类型，Schema还可以定义method。所有脱胎于这个Schema的对象，都有了相同的格式和method。

```javascript
// 定义Schema
var priceSchema = new Schema({
    date:   {type: Date, index: true},
    name:   String,
    _market: {type: Schema.Types.ObjectId, ref: 'Market'},
    min:    Number,
    max:    Number,
    avg:    Number,
    unit:   {type: String, default: '元/千克'},
    tags:   [String]
});

var marketSchema = new Schema({
    name:   String,
    lat:    Number,
    lng:    Number,
    province: String,
    city:   String,
    district: String,
    street: String,
    StreetNumber: String
});
```

priceSchema有一个_market字段值得注意，使用下划线开头是为了强调它的特殊性。ref: 'Market'表示它引用的类型，也就是说这个字段是一个以Market为model生成的instance。
上面的例子里，所有字段的类型都是基础类型，嵌套类型如何表达呢？

    nestedTypeField: {
        x: {
            y: Number,
            z: [String]
        }
    }

其实这个字段的类型是匿名的Model，对已有的Model，直接把Model作为类型即可。


##Model

按照习惯上对ORM的理解，不就只有类和对象吗？类对应着表定义，对象对应着表中的记录。但是mongoose却整出来三个概念，Schema对应着表定义，instance对应着表记录，Model是干啥的？

可将Model理解成Schema和instance之间的粘合剂，Schema生Model，Model生instance。然而从日常用途来看，主要是通过Model来增删改查。

首先需要以一个Schema为模板生成Model，然后拿这个Model去create, find, remove, update.

```javascript
// 由Schema创建Model
var Price = mongoose.model('Price', priceSchema);
var Market = mongoose.model('Market', marketSchema);
```


##instance

一个instance就是一条数据，也就是collection中的一个document。


#CRUD操作

## create

向数据库插入数据，一种方法是生成instance，然后调用instance上的save方法。另一种是直接调用Model上的create方法。

```javascript
// create的示例代码
function create(){
    // 准备数据
    var marketJson = {
        name: "抚顺路蔬菜副食品批发市场",
        lat: 36.103964,
        lng: 120.38536,
        province: "山东省",
        city: "青岛市",
        district: "市北区",
        street: "哈尔滨路",
        streetNumber: "13号"
    };

    // 由Market Model创建一个instance
    var market = new Market(marketJson);

    var priceJson = {
        date: new Date('2014-10-16'),
        name: '大白菜',
        _market: market._id, // 拿_market的id作为ref
        min: 0.9,
        max: 1.1,
        avg: 1
    };

    // instance直接save的方式添加document
    market.save(function(err){
        if (err) return handleError(err);

        console.log('create market success', market);
        // 使用Model的create方法添加document
        Price.create(priceJson, function(err, price){
            if(!err){
                console.log('create success', price);
                emitter.emit('startQuery'); // 触发下一步的查找操作
            }
        });
    });
}
```

## query

增删改查这四个里面，查是永远的主角。MongoDB不是关系型数据库，没有多表联合查询这一说，因此需要转换一下思维。

首先，在MongoDB里尽量不要拆表，能用一个collection表示的，就别再拆出一个collection来，这样做的好处是减少多表查询，提高性能。

如果实在不能忍了，比如就是有一个字段，不仅数据量大，而且重复特别多，那就拆表。由于MongoDB不支持多表联合查询，所以要通过写程序来实现。自己写程序，就要避开坑，比如

> where A.a = 'XXX' and B.b = 'YYY'

A和B是不同的collection，正确做法是把A和B中所有满足条件的先都取出来，再写代码求交集。可千万别在取交集的时候，每做一次比较都去query数据库，那样性能就完蛋了。

mongoose提供了一个populate方法，可以简化联合查询的写法，即将外键字段直接填充成对象，而不仅仅是一个外键id，请看下面例子：

```javascript
// 查询示例代码
function query(){
    // findOne查一个
    var findPromise = Price
        .findOne({ name: '大白菜' })
        .exec();

    // exec的返回值，同时继承了Promise和EventEmitter
    // 因此既可以then也可以on

    // 利用Promise的then方法来等待操作结果
    findPromise.then(
        function(price){
            console.log('promise fulfill');
            console.log(price); // findOne返回单个对象
        },
        function(err){
            console.log('promise reject');
            return handleError(err);
        });

    // 利用侦听complete/err事件来等待操作结果
    findPromise.on('complete', function(price){
        console.log('event complete');
        console.log(price); // findOne返回单个对象
    }).on('err', function(err){
        handleError(err);
    });

    // 用populate填充外键字段
    Price.findOne({name: '大白菜'})
        .populate('_market')
        .exec(function(err, price){
            if (err) return handleError(err);
            console.log('after populate >>>>>>>> \n', price);
        });

    // find查多个
    Price
        .find({ name: '大白菜' })  // equal
        .find({ name: /^大/ }) // like
        .where('avg').gt(0.8).lt(1.2)  // less than, greater than
        .where('avg').gte(0.8).lte(1.2) // between
        .where('name').in(['大白菜', '菠菜']) // in
        .sort('avg') // order by asc
        .sort('-avg') // order by desc
        .limit(10) // top
        .select('name min max avg market') // select
        .exec(function(err, prices){
            if (err) return handleError(err);
            console.log(prices); // find返回数组
            emitter.emit('startUpdate');
        });
}
```

## update

更新没啥好说的，会写conditions条件基本就没问题了。还有一种更新方法，是先查找出instance，直接修改instance的属性，然后调用intance的save方法。

```javascript
// update示例代码
function update(){
    // Model.update(conditions, update, [options], [callback])
    Price.update(
        { name: '大白菜', avg: {$gt: 0.9} }, // condition
        { avg: 1.1 }, // update to
        { multi: true }, // options
        function (err, numberAffected, raw) { // callback
            if (err) return handleError(err);
            console.log('The number of updated documents was %d', numberAffected);
            console.log('The raw response from Mongo was ', raw);
            emitter.emit('startRemove');
        });
}
```

## remove

删除没啥好说的，注意一点，如果要立即执行删除，最简单的方法是传入callback，否则只会返回一个query对象，并不立即执行。其实增删改查也都一样，想立即执行，要么传入callback，要么调用exec方法。

```javascript
// remove示例代码
function remove(){
    // 删一个
    Price.findOneAndRemove({name: '不存在'}, function(err){
            // 删除不存在的不会报错
            if (err) return handleError(err);
        }
    );

    // 删多个
    Price.remove({name: '大白菜'}, function(err){
        if (err) return handleError(err);
    });

    // 全删
    Market.remove(function(err){
        if (err) return handleError(err);
    });
}
```

## 用事件串行化

增删改查都是异步返回的，为保证一个操作完成后再执行下一个，就要有一个机制来串行化。callback里面再套callback是一种做法，但不够优雅。Promise的then是一种方法，
NodeJS本身提供的event也是很好的选择。下面例子是使用event来串行化。

```javascript
emitter.on('startQuery', function(){
    query();
});

emitter.on('startUpdate', function(){
    update();
});

emitter.on('startRemove', function(){
    remove();
});

create(); // 从创建开始
```

[完整示例代码](/js/example/mongooses-attack-1.js)
