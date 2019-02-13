---
title: 可扩展的 WebSocket Server
date: 2017-09-21 07:00:00
layout: post
style: code
---

WebSocket 的服务端一旦起了多个实例，就要处理各实例之间通信的问题。

不同的实例可能是同一台服务器上的不同进程，也可能位于不同服务器，所以必须处理好跨进程通信。

# 在分布式系统中传递
先来想一个场景，Client A 与 Server A 之间有一条 WebSocket 连接，Client B 与 Server B 之间有一条 WebSocket 连接。此时 Client A 要发一条消息给 Client B，该如何做呢？

在服务端我们借助 Redis 的「订阅/发布」功能来实现服务器之间的通信，即Server A 和 Server B 都订阅了 Redis 的同一个频道。如下图：

![](/img/2017/scalable-websocket-server_pass.png)

1. Client A 通过 WebSocket 发消息给 Server A
2. Server A 将消息发布到 Redis 的某个频道
3. Redis 通知这个频道的所有订阅者
4. Server B 收到了订阅消息，在它已建立的所有 WebSocket 当中寻找属于 Client B 的
5. 找到后将消息由那个 WebSocket 发出去，Client B 会在 WebSocket 的另一端收到消息

# “广播”消息
WebSocket 的广播并不是真正意义上的广播，而是一个 socket 接一个 socket 地发消息，全都发个遍，结果上看等同于广播。

就好比学校要下达一个通知，不用扩音喇叭喊，而是给每个人打电话，最终消息也能送达给所有人，从效果上看是一样的。服务器必须清楚，哪根电话线连着哪台设备，以及它是属于哪个用户。

使用 [ws](https://github.com/websockets/ws) 实现服务端，WebSocket Server 会有一个 clients 属性，它是已经建立起连接的 WebSocket 数组，可以把一个 WebSocket 想象成是电话线的一端，电话线的另一端坐着一个等电话的人，也就是客户端。

我们还是用一个例子来说明，假如 User A 要发一条消息给 User B，并希望 User B 所有的设备都能收到这条消息，也就是对 User B 所有设备发广播，如何实现呢：

![](/img/2017/scalable-websocket-server_broadcast.png)

在建立连接的阶段，就要先做好准备工作：

1. 服务器在与客户端建立 WebSocket 连接时，在自己的进程内存中维护一个哈希表，给每个 socket 生成唯一的 ID 作为哈希表的 key，socket 对象本身作为哈希表的 value
2. 同时在 Redis 上给每个用户维护一个集合，集合中存着归属于这个用户的 socket ID

当 User A 发出消息后，接下来会是这样的：

1. Server A 收到消息后，先去 Redis 上查 User B 有哪些 socket
2. 把查到的 socket ID 连同消息一起发布到 Redis，所有订阅者都会收到这个消息以及要发送至的 socket ID
3. 订阅者 Server A 和 Server B 分别查自己进程维护的哈希表。Server A 找到了一个，它是连接 User B 的手机的 socket；Server B 找到了两个，分别是连接 User B 的笔记本和平板的 socket。
4. 订阅者进程通过找到的 socket 把消息发送出去。Server A 发送到了一条消息到 User B 的手机，Server B 发送了两条消息，分别至 User B 的笔记本和平板。于是 User B 的三台设备上都收到了消息。

# 清理死掉的 socket
尽管有 close 事件告知服务端某条连接断了，但是会出现连接已经断开但 close 事件没触发的情况。

这些死掉的 socket 白白占用了系统资源，而且势必越积越多，所以需要有个清道夫来清理它们。具体做法就是起一个定时器，每隔比如五秒钟 ping 一下客户端，如果没有收到 pong，则说明客户端很可能已经死掉了，就释放掉这条连接回收系统资源。

# WebSocket 的故障转移
![](/img/2017/scalable-websocket-server_load-balance.png)
上图中，如果 Server A 进程退出了，那么它的所有资源都会被操作系统回收，socket 是一种系统资源，所以当然也会被系统回收。

发生这种事情，只能让客户端重连了。客户端检测到连接断开，就重新发起连接。负载均衡器会把来的连接都分给 Server B，因为 Server A 挂了嘛，导致原来 Server A 的连接都转移到了 Server B 上。

后端升级的时候更加尴尬，假设 Server A 先升级 Server B 再升级，那么当 Server A 重启的时候，原本属于 Server A 的客户端连接全断开，然后重连到 Server B 上。紧接着 Server B 重启，客户端连接全部断开重连，都转移到了 Server A 上。经过这一番折腾，原本均匀分散在两台服务器上的连接汇集到了同一台服务器。而且伴随着大量反复的断开和重连，给系统造成很大开销，这显然不是一个理想的结果。

一个解决方法是把 WebSocket 服务和业务服务分开。WebSocket 服务保持着与客户端的连接，只负责通信，没有业务代码，基本不需要重启。而业务服务负责具体的业务，经常升级重启，重启就重启吧，建好的长连接不受影响。


