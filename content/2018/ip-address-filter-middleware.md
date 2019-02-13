---
title: IP 地址过滤中间件
date: 2018-05-14 07:00:00
layout: post
style: code
---

出于安全性考虑，有些服务会限制调用方的 IP 地址。

比如公司内部不对外公开的服务，我们自己想要限制 IP。再比如有些按量付费的对外接口，客户担心自己的身份被冒用而要求我们限制调用方的 IP 地址，这时客户会给我们一个 IP 白名单，这是客户服务器的固定 IP，只有从这些服务器发出的请求才认为是合法的。

IP 过滤放在 API Gateway 里面去实现越来越成为主流，不过在业务代码里实现更加灵活，定制化程度也最高。因为不同的业务需求不一样，导致过滤的规则不一样、请求的响应格式不一样、特判条件不一样，所以统一处理的意义就不大了。而且也不是什么场景都需要一个 API Gateway 的。

本文就介绍一个 Node.js 的 IP 过滤中间件（两个版本）：
* [Koa 版：restrict-ip-koa-middleware](https://github.com/zhike-team/restrict-ip-koa-middleware)
* [Express 版：restrict-ip-express-middleware](https://github.com/zhike-team/restrict-ip-express-middleware)

## IP 从哪里来
客户端发来的 HTTP 请求完全是由客户端构造的，无论是 header 还是 body 客户端想伪装成任何样子都可以。剩下唯一可以信任的就是 IP 地址了。IP 地址不在 HTTP 请求中，但经过 nginx 的时候，nginx 可以把 IP 地址附加到 HTTP header 里。

``` nginx
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

上面的配置中，第一行是在 header 设置一个名为 X-Real-IP 的字段，值是客户端 IP 地址。第二行则稍微复杂，如果没有  X-Forwarded-For 字段则添加这个字段并令其等于客户端 IP 地址，如果已经存在 X-Forwarded-For 字段，则在它的现有值的后面追加上客户端 IP 地址。

一个 HTTP 请求过来，假如客户端 IP 地址是 1.2.3.4，

如果没有 X-Forwarded-For 字段，那么 nginx 会给 HTTP header 这样设置：
```HTTP
X-Real-IP: 1.2.3.4
X-Forwarded-For: 1.2.3.4
```

如果有 X-Forwarded-For 字段，且值为 5.5.5.5，那么 nginx 会给 HTTP header 这样设置：
```HTTP
X-Real-IP: 1.2.3.4
X-Forwarded-For: 5.5.5.5, 1.2.3.4
```
我们发现 X-Forwarded-For 是在原值后面加了一个英文逗号，一个空格，然后才是客户端的 IP 地址。这样做的目的是为了追溯更详细的转发过程。但要保持警惕，因为 X-Forwarded-For 前面的值有可能是从客户端发来的。

现在情况变得有些复杂，因为涉及到一个是否要信任  X-Forwarded-For 的问题。如果涉及到安全，是不该信任客户端的，所以入口 nginx 服务器上，就这样配置：
``` nginx
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $remote_addr;
```
注意，这次 X-Forwarded-For 的值被直接设置为客户端 IP 地址，抹掉了之前客户端携带的 X-Forwarded-For。


## 私有地址（内网 IP）
IP 过滤的一大目的之一，就是保护内部接口不对外暴露，通常一个公司的服务都在同一个内网，所以只允许内网 IP 访问就是最简单的防御策略。

接下来问题来了，哪些 IP 地址属于内网地址呢？

- Private Address
	* IPv4
		* Class A： 10.0.0.0 - 10.255.255.255
		* Class B： 172.16.0.0 - 172.31.255.255
		* Class C： 192.168.0.0 - 192.168.255.255
	* IPv6
		* fdxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx

* Loopback
	* 127.0.0.1 (IPv4)
	* ::1 (IPv6)
可以看到，一个 IP 地址是不是私有地址，判断起来还挺麻烦。我用 [ip](https://www.npmjs.com/package/ip)
这个 npm 包的 `ip.isPrivate(ipAddress)` 方法来判断是不是私有地址，就不用自己写逻辑判断了。


## 性能和其他权衡
判断是否在 IP 黑白名单这种场景，首先想到的就是查 Redis。但仔细想想也许放在内存更好。因为 IP 黑白名单一般不会有太多，在内存里不会有空间问题，要重点解决的可能是当黑白名单变化时如何同步到进程的内存里。

目前一些做的比较好的配置管理工具例如 consul 都有监听变化的功能，所以热更新也不是难事。在这种情况下，放在内存中就没什么问题了。而且内存中因为代码是同步的（而不是像 Redis 那样的 IO 操作），无论代码的执行效率还是写代码的简洁程度均有优势。在这样的考虑下，我选择了把黑白名单放在内存中管理，数据结构则采用了最适合做这件事的 Set。

## 基本用法
```js
const Koa = require('koa')
const restrictIp = require('@zhike/restrict-ip-koa-middleware')

const whitelistRestrict = restrictIp({
  whitelist: new Set(['2.2.2.2', '3.3.3.3'])
})

const app = new Koa()
app.use(whitelistRestrict)
```

## 功能

- 白名单通过策略：只有白名单内的 IP 允许访问
- 黑名单拦截策略：只有黑名单内的 IP 不允许访问
- 内网地址通过：与白名单策略配合使用，允许不在白名单内的内网 IP 地址通过
- 自定义方式获取 IP 地址：取 IP 地址可用自定义方式，例如从 Header 里取 x-forwarded-for 或者 x-real-ip 字段等
- 自定义拦截后的处理方法：拦截或允许通过、自定义返回消息体、一些需要特判的情况都可以在这里处理

## 默认行为

### 默认取 IP 地址的次序
如果不设置 trustedHeaderSequence，默认取 IP 地址的次序是：
1. HTTP header 里的 x-forwarded-for 中最左边的 IP 地址
2. HTTP header 里的 x-real-ip
3. 直接 IP，即 ctx.ip

### 默认拦截行为
如果不设置 onRestrict 方法，需要拦截的时候，默认会抛出一个默认 Error：
1. 需要拦截的时候，默认抛出 Error
```js
let err = new Error('IP restricted');
err.ip = ipToCheck;
throw err;
```
默认 Error 的特征：具有固定的 message: "IP restricted"，另有 ip 字段为被拦截的 IP 地址。


## 测试用例

```
  白名单外网地址
    ✓ 在白名单，通过
    ✓ 不在白名单，拦截

  白名单且允许内网地址
    ✓ 不在白名单，但是本机地址 通过
    ✓ 不在白名单，但是是 A 类内网地址 通过
    ✓ 不在白名单，但是是 B 类内网地址 通过
    ✓ 不在白名单，但是是 C 类内网地址 通过
    ✓ 不在白名单，也不是内网地址 拦截

  黑名单策略
    ✓ 不在黑名单 通过
    ✓ 在黑名单 拦截

  自定义函数拦截
    ✓ 自定义拦截函数 通过
    ✓ 自定义拦截函数 拦截

  自定义方式获取 IP 地址
    ✓ trustedHeaderSequence 不指定，默认先 x-forwarded-for 后 x-real-ip
    ✓ trustedHeaderSequence 按指定顺序
    ✓ trustedHeaderSequence 为空数组，看直接 IP
```

