---
title: WebSocket in Node.js
date: 2015-10-07 07:00:00
layout: post
style: code
tags:
---

## 真·长连接

有一些场景，我们希望能够看到实时变化，例如在线聊天、弹幕、游戏、比赛图文直播等等。这要求在客户端（也就是浏览器）与服务端之间保持所谓的长连接。

什么是长连接呢？在那本古老的《UNIX 网络编程》里，一上来给的示例代码就是建立一个 TCP 长连接，那段代码当时我看了几遍，印象很深。长连接是一个非常古老的技术了，简单说就是建立连接后不断开，一直用这条连接收发数据。

没想到过了这么多年，长连接反倒变成了一件稀罕的东西。由于 HTTP 协议的局限性，网页端的长连接都是假的。简单介绍几种经典的江湖骗术：

1. 轮询：也叫“无耻地轮询”，比如一秒钟发一次 HTTP 请求，用频繁发起的短连接来模拟长连接，是最臭不要脸的方式没有之一，同时也是全球变暖的罪魁！

2. 长轮询：客户端发一个 HTTP 请求，服务端 hold 住不给应答，直到有数据要发给客户端的时候再给应答，以此来模拟服务端主动发消息给客户端。长时间无消息连接也会超时断开。无论应答还是超时，这一次连接都会断掉，那么客户端会再次发起一次新的 HTTP 请求，循环往复。与真·长连接相比，一来一回还是挺费流量的，何况每次都要带上 HTTP 的 header。长轮询比频繁轮询有改进，但并不彻底。

3. 流：网页内嵌一个看不见的 iframe，让这个 iframe 的 src 指向一个加载不完的 html，当服务端需要推送时，就往这个没问没了的 html 里追加一段脚本，这段新的脚本会被浏览器收到并解析，而这段脚本的作用是调用父窗口的某个函数（window.parent.xxx），也就实现了通知父窗口。像这样的奇技淫巧，我是看不上的。但在没有 WebSocket 的时候，这是最省流量的方法。

以上三种方法，除了第一种“无耻地轮询”，第二第三种属于某个专有的技术名词 —— comet。虽然应用的很广，但它们毕竟不是真·长连接，只有在一条连接上实现全双工才配得上「真·长连接」的称号。


## WebSocket

> WebSocket 协议本质上是一个基于 TCP 的协议。为了建立一个 WebSocket 连接，客户端浏览器首先要向服务器发起一个 HTTP 请求，这个请求和通常的 HTTP 请求不同，包含了一些附加头信息，其中附加头信息”Upgrade: WebSocket”表明这是一个申请协议升级的 HTTP 请求，服务器端解析这些附加的头信息然后产生应答信息返回给客户端，客户端和服务器端的 WebSocket 连接就建立起来了，双方就可以通过这个连接通道自由的传递信息，并且这个连接会持续存在直到客户端或者服务器端的某一方主动的关闭连接。

以上摘自 IBM developerWorks，它回答了一个问题：WebSocket 是 HTTP 协议的一部分，或者基于 HTTP 协议的吗？No！虽然是浏览器上用，但 WebSocket 直接基于 TCP 协议，和 HTTP 在同一层上并列，只不过它要借助 HTTP 建立起连接。

WebSocket 各种好，唯独浏览器兼容性是个问题，IE 10 才开始支持，Windows 8 之前自带的 IE 浏览器可能会不支持。下面就介绍一个既能解决兼容性又能充分利用 WebSocket 性能的 JavaScript 库。

## socket.io

[socket.io](https://github.com/socketio/socket.io) 在服务端是 Node.js，客户端也是 JS，它支持四种方式，按优先选择的顺序依次为 WebSocket、htmlfile、xhr-polling、jsonp-polling，会根据浏览器的支持情况酌情选择最佳的通信方式。

关于 socket.io 的更多内容，见[官方文档](http://socket.io/docs/)。

下面来做一个 demo，首先用 WebStorm 新建一个 Node.js Express 项目，建好后在 package.json 文件的 dependencies 里追加一行 socket.io ：

```json
"dependencies": {
    "body-parser": "~1.13.2",
    "cookie-parser": "~1.3.5",
    "debug": "~2.2.0",
    "express": "~4.13.1",
    "hbs": "~3.1.0",
    "morgan": "~1.6.1",
    "serve-favicon": "~2.3.0",
    "socket.io": ""
}
```

然后执行 npm install 来在服务端安装最新版本的 socket.io。

客户端的脚本最好与服务端版本保持一致。从哪里获取客户端的 socket.io 库呢？首先，你需要知道服务端的版本号，执行命令：

    $ npm list socket.io

目前我服务端的版本号是1.3.7，于是下载客户端的版本号也是1.3.7，用 curl 命令下载：

    $ curl https://cdn.socket.io/socket.io-1.3.7.js > socket.io.js
    
至此，服务端和客户端的 socket.io 库都已经准备好。下面用 Express 写一个最简单的 socket.io 通信程序。

这个小 demo 做的事情是：客户端发起连接，服务端连上后立刻发一个消息给客户端，客户端收到这个消息，再回一个消息给服务端。逻辑非常简单。

首先写客户端代码，在 public 目录下新建一个 index.html 文件内容如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
  <script src="/socket.io.js"></script>
  <script>
    var socket = io.connect('http://localhost:3000');
    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });
  </script>
</head>
<body>

</body>
</html>
```

客户端没什么好说的，连接到本机的3000端口，收到服务端的消息后回一个消息。

下面来看服务端，服务端由于用了 Express，还真是有点别扭。先上代码后解释：

代码只有两处改动：

/app.js，文件末尾加上如下代码：

``` javascript
var io = require('socket.io')();
app.io = io;
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
```

/bin/www，文件末尾加上如下代码：

``` javascript
var io = app.io;
io.attach( server );
```

我给出的代码和官网给的示例代码不一样，按照官网代码的写法应该是这样：先建一个 http server，然后以这个 http server 为入参创建一个 socket.io server（代码中实例的变量名是 io）。示例代码的写法本身没问题，但由于 http server 是在 bin/www 文件里定义的，所以 http server 只在 bin/www 里可见，那么由 http server 创建的 socket.io server 也只好在 bin/www 里定义，并只在这个文件里可见，于是 socket.io server 上的消息处理也只好放在 bin/www 文件中。这不合适，因为 bin/www 只是一个启动脚本，应该保持精简，不应该包含业务逻辑代码。

幸好 socket.io server 有一个 attach 方法，可以在一个已有的 http server 上挂载一个 socket.io server。这样就可以把创建 socket.io server 的代码放在 app.js 文件里，并让它成为 app 的一个属性（app.io），在 bin/www 里以 app.io 的写法引用到它。

相比于之前都放在 bin/www 里的做法，app.js 放业务逻辑更合适。但也要注意控制 app.js 文件的大小，建议将具体逻辑的实现（消息处理）封装成 module 放到单独文件里，以 module.exports 的方式导出给 app.js 去使用。

app.js 文件是整个 Express 项目的枢纽，只要在 app.js 里可见，就可以把 app.io 当做入参传给各业务模块，将消息处理的逻辑分摊到各个模块，整个项目的结构就灵活可控了。


[本文代码下载](/file/socket.io-express.zip)
