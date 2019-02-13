---
title: 认真写一个 WebSocket Server
date: 2017-09-28 07:00:00
layout: post
style: code
---

之前两篇文章 [请忘掉 Socket.io](http://www.maintao.com/2017/forget-socketio/) 和 [可扩展的 WebSocket Server](http://www.maintao.com/2017/scalable-websocket-server/)，都是在讲解原理，这次我们来落实到代码上。

为了方便读懂代码，先说明一下消息格式：
从客户端发出的一条消息，长这样：
```js
{
	content: "消息内容",
	to: ["user1", "user2"], // 接收者的 userID
}
```

因为早在建 WebSocket 连接的时候，服务端就知道这条连接是哪个用户的，于是服务端收到消息后，便知道发送者是谁，服务端通知 Redis 的消息就长这样：
```js
{
	content: "消息内容",
	from: "user3", // 发送者的 userID
	to: ["user1", "user2"], // 接收者的 userID
}
```

接收到 Redis 通知的服务端，下发给客户端的消息体长这样：
```js
{
	content: "消息内容",
	from: "user3", // 发送者的 userID
}
```

以下是代码，注释详细：

```js
const querystring = require('querystring')
const WebSocket = require('ws')
const Redis = require('ioredis')
const uuidv1 = require('uuid/v1')
const redis = new Redis()
const sub = new Redis()

const heartbeatInterval = 3 * 1000
const deathTimeSpan = 6 * 1000 // 这么长时间无心跳则认为死亡

const port = process.argv[2]
const clientMap = {}

const wsServer = new WebSocket.Server({
  port: port,
  verifyClient: function (info, cb) {
    const token = querystring.parse(info.req.url.replace(/^.*\?/, '')).token
    if (['red', 'yellow', 'blue'].includes(token)) {
      info.req.userId = token
      cb(true)
    } else {
      cb(false, 401)
    }
  }
})

// updateClientStatus 函数用来更新时间戳，防止被回收
function updateClientStatus(client) {
// Redis 里存 Hash，RedisKey 是 userId
// Hash 的 key 是 clientId（uuid），值是上次活跃的时间戳（秒）
  client.lastTime = Date.now()
  let redisKey = `ws:${client.userId}`
  // 因为 redis.call("TIME") 在不同机器上的值会有不同
  // 为保证数据一致，默认 Redis 会拒绝执行，当做错误抛出
  // 我们这里只用它来判断连接是否过期，与 Redis 本机的时间比较，并不要求各节点的数据一致
  // 所以率先调用 replicate_commands 来让 Redis 允许使用 TIME 命令
  const lua = `
          redis.replicate_commands()
          redis.call("hset", KEYS[1], ARGV[1], tonumber(redis.call("TIME")[1]))
          redis.call("pexpire", KEYS[1], ARGV[2])
          `
  // 为防止服务端问题导致 RedisKey 没有回收，有必要给 RedisKey 设置一个超时时间
  return redis.eval(lua, 1, redisKey, client.id, deathTimeSpan * 2)
}

function deleteClient(client) {
  let key = `ws:${client.userId}`
  clearInterval(client.heartbeatTimer)
  client.terminate() // 会自动从 wsServer.clients 中删除
  return redis.hdel(key, client.id)
}

function findAndSend(msg) {
  let json = {
    from: msg.from,
    content: msg.content
  }
  for (let clientId of msg.to) {
    let client = clientMap[clientId]
    if (client) {
      client.send(json)
    }
  }
}

sub.subscribe('message', function (err, count) { })

sub.on('message', function (channel, msg) {
  let json = JSON.parse(msg)
  if (json.type === 'broadcast') {
    wsServer.clients.forEach(client => {
      client.send(msg)
    })
  } else if (json.type === 'multi') {
    findAndSend(json)
  }
})

// 连接建立时，给连接分配唯一ID，并标记所归属的用户的ID
// 用 uuid v1 而不是 v4，uuid-v1 有时间戳和机器的 MAC 地址
// 原因是这个 ID 只在后端存在，而且将来也许会用来了解创建时间以及来自哪台机器
wsServer.on('connection', function connection(client, req) {
  client.userId = req.userId
  client.id = uuidv1()
  updateClientStatus(client)
    .then(() => {
      clientMap[client.id] = client

      client.on('message', msg => {
        console.log('received: ', msg)
        updateClientStatus(client)
        let json = JSON.parse(msg)
        json.from = client.userId
        findAndSend(json)
      })

      client.on('pong', () => {
        updateClientStatus(client)
      })

      client.heartbeatTimer = setInterval(() => {
        if (client.lastTime + deathTimeSpan < Date.now()) {
          deleteClient(client)
        } else {
          client.ping('', false, true)
        }
      }, heartbeatInterval)
    })
    .catch(e => {
      // 一开始没写进redis，就干脆断掉链接，以免造成更大混乱
      client.terminate()
    })
})
```
