---
title: 请忘掉 Socket.io
date: 2017-09-14 07:00:00
layout: post
style: code
---

Socket.io 是一个非常有名的 JS 双向通信库。在浏览器对 WebSocket 支持参差不齐的过去，Socket.io 凭借其强大的兼容性，几乎是服务端推送的唯一选择。然而时至今日，浏览器几乎都普及了 WebSocket，连微信小程序也不例外，继续用 Socket.io 这么重的工具就十分没有必要了。

程序员在做选型的时候，一般喜欢轻而不喜欢重。不喜欢重的原因，不光是因为代码量大、下载时间长这些表象，有一个被忽视的重要原因就是学习成本和查错成本。

「复杂」这个词什么时候是褒义什么时候是贬义，区分的界限往往很微妙，但宗旨大概是这样：当一个内部逻辑非常复杂的库对外的接口很简洁，它的复杂就是值得赞颂的。当一个库的接口很复杂，有这样那样的注意事项，它的复杂就是被人嫌弃的。

可定制化程度高的库，与之相伴的往往是接口的复杂，这时候就需要智慧来权衡：哪些项真正值得定制化，即便会付出变复杂的代价。

Socket.io 很强大，但也同时非常臃肿。臃肿不是说它为了兼容老版本浏览器而做的脏活累活，而是外延过大，越界了。下面列举几点：

* 它内置了一套聊天室的逻辑。怎么就判断用它的人一定是想做聊天室？通常只是想要一个服务端推送而已。
* 在搭配使用 redis 的时候，会强制用 MessagePack 格式。如果别的程序要共享 Redis 里的数据，就不得不处理 MessagePack 的解析。
* 定制了自己的[Socket.io Protocol](https://github.com/socketio/socket.io-protocol)，这个协议初级用户不必知道，但是一旦深入了需要触碰到，就不得不去理解消化。

一个工具自身庞大，学起来必然就复杂，读文档就会读到很多压根不需要的内容，对学习者来说，无疑是干扰和负担。而对工具的维护者来说，每次动手改之前都要把一大堆规则装进脑子，效率自然高不了，其实也是作茧自缚。

讲了这么多大道理，来看看 Socket.io 的替代品 —— [ws](https://github.com/websockets/ws)。这个库速度快，做的事情少，实现的是标准的 WebSocket 协议，即 [RFC 6455](https://tools.ietf.org/html/rfc6455)。

ws 实现了 WebSocket server，同时也实现了一个 WebSocket client，不过我认为这个 client 的价值不大，因为浏览器原生的 WebSocket 已经足够用了，而且你的客户端可未必只用 JavaScript，只要实现了标准的 WebSocket 协议，客户端爱用啥用啥。

ws 的文档写的不错，我就不啰嗦了，只强调一点，那就是 WebSocket 的鉴权。HTTP 的鉴权大家都熟悉，每次请求都是一个 TCP 短连接，所以每一次请求都要鉴权，一般是带一个 token 在 HTTP Header 里（通常放在 cookie 或者 authorization 字段），也可以带在 URL 里或者 body 里。WebSocket 因为是长连接，情况要好很多，只需在一开始建立连接的时候鉴权，之后的收发消息就不用再带 token 了。

好消息听完，来一个不好的消息。浏览器版本的 WebSocket 在建立连接时不能自定义 Header，只能携带浏览器默认带的数据（比如 cookie），任何自定义 header 字段（比如 authorization）都别指望了。这么一限制，就只剩下两种方案：

1. token 放在 cookie 里
2. token 放在 URL 里

两种都是我不喜欢的，怎么办怎么办…… 我个人更倾向于第二个方案，即 token 放在 URL 里。理由是，URL 在 https 下是加密的，所以不必担心 token 被中间人截获，这里再次强调务必使用 wss:// 协议！不用 cookie 的原因，一是现在不流行在 HTTP 请求中带 cookie 了，二是像微信小程序这样的干脆不支持 cookie（虽然往 HTTP header 里硬写也能扮成 cookie，但是丑啊），如果在程序中的 HTTP 请求都不使用 cookie 鉴权，那这个 cookie 就更是个累赘了，果断选择第二个方案。

官网有一段 ws 连接时鉴权的[示例代码](https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js) ，用的是 express-session，它底层依赖了 cookie。虽然我并不推荐它用 cookie 的实现方法，但它起码把连接时鉴权的套路写明白了：即客户端先通过登录接口（一个 HTTP 请求）拿到 token，再带着 token 发起 WebSocket 连接，在服务端构造 WebSocket 对象时传入的 verifyClient 函数里去判断 token 是否有效。

```js
const WebSocket = require('ws');
const wsServer = new WebSocket.Server({
  port: 8080, // 只要端口对的上就能连，不会去判断 URL path
  verifyClient: (info, done) => {
    // 如果要对 URL 的域、路径、参数等校验，需要在这个函数里进行
    info.req.url // HTTP URL，包括路径和参数
    info.req.origin // 可用来辨别是从哪个域发来的
    info.req.headers // HTTP header，包括 cookie，只不过用浏览器原生的 WebSocket 无法自定义 header 中的字段

    done(true);  // 传入 true，表示验证通过，建立连接
    done(false); // 传入 false，表示验证失败，拒绝连接
  }
});
```


