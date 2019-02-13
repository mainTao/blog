---
title: 微信小程序登录
date: 2018-08-07 07:00:00
layout: post
style: code
---

微信小程序从 2016 年底就开始火了，当时看小程序登录这块就挺复杂。时过两年重温小程序，API 比之前更复杂、更让人摸不着头脑了。

网上介绍小程序登录的文章大多着重于具体实现，也就是 How，而对于 Why 解释的比较浅。我本着解救天下苍生的精神，剥开重重迷雾、去伪存真，最后给出一个简单实用的小程序登录方案。

要理解本文，至少先看过这页文档： [小程序登录接口官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html) ，然后再回来接着往下看。

## session_key 是什么鬼？
用 Redis 这种 KV 存储来存放 session 早已经很普遍了，具体做法就是将一个字符串作为 key，而将 session 的内容作为 value。所以这个 session_key 很容易让人想到 Redis 的 key。这是一个很大的误导！

文档中的 session_key 其实是一个秘钥。当用户在微信小程序上调用了 wx.login() 之后，会在微信服务器上生成一个 session，和与此对应的一个秘钥(key)，这个秘钥的生命期与 session 相同。这是 session_key 名字的由来。

那这个 session_key 用来做什么用呢？请看[这页文档](https://developers.weixin.qq.com/miniprogram/dev/api/signature.html)。

其实这个 session_key 的用处只有两个：

1. 用于校验 UserInfo 的 signature
2. 用于解密 UserInfo 的 encryptedData

我们一个一个来讲。

### 为什么要验证签名？

UserInfo 中会包含一个 rawData 明文字符串，就是用户信息（不含敏感字段） JSON.stringify 后得到的字符串。因为是明文，其中不包含 openId 这样的敏感字段。同时还会包含一个 signature：

    signature = sha1( rawData + session_key )


为什么需要这个签名呢？官方文档上并没有讲明白。签名就是为了防篡改，此处是用于辨别客户端传来的用户信息的真伪。我们如何能信任客户端传来的 rawData 是真实的用户信息呢？signature 正是干这个用的！由于 signature 需要 session_key 计算得到，而客户端是不知道 session_key 的，所以伪造不了。

这个 session_key 是保密的，只允许微信服务器和开发者服务器知道，微信用 session_key 对 rawData 进行签名得到一个 signature，开发者服务器做同样的操作，如果得到的 signature 相同，说明他们的 rawData 也是同一份，也就证明了 rawData 是出自微信服务器且没有被篡改过。

### 为什么要加密？

UserInfo 中还会包含一个 encryptedData 密文字符串，就是用户信息（包含敏感字段）JSON.stringify 后得到的字符串。之所以要加密，正是因为有 openId 等敏感字段的存在。

encryptedData 是个大而全的字段。不过我认为，这个 encryptedData 没有什么卵用。我们先思考一下 encryptedData 的用途：

1. 包含 openId、 unionId 敏感字段
2. 因必须用 session_key 才能解密，所以可保证用户数据是真的

就第一条讲，在业务服务器调用 jscode2session 接口的时候，会返回如下内容：

```js
{
    "openid": "OPENID",
    "session_key": "SESSIONKEY",
    "unionid": "UNIONID" //满足UnionID返回条件时
}
```

很明显这里面包含了 openId 和 unionId，而且因为是从微信服务器取的，所以不必担心正确性。

就第二条讲，rawData + signature 也可以达到保证数据真实的目的。而且相比加解密还有两个好处，一是 rawData 的长度大约只有 encryptedData 的一半，减少网络传输，二是计算签名比解密更少消耗 CPU。

综上，encryptedData 完全可被替代，且应该被替代。

## 简化流程

微信官方推荐做法，是让业务服务器存好 session_key，以便在必要时（计算签名和解密时）用到它。业务服务器还要保证存在自己那儿的 session_key 没有过期，而 session_key 什么时候过期呢？微信并没有一个明确的说法。

小程序客户端提供了一个方法 `wx.checkSession` 来判断当前客户端的 session 有没有过期。如果过期了则必须调用 `wx.login` 来刷新 session，并且让业务服务器拿 wx.login() 返回的 code 去换取最新的 session_key。此过程无疑是麻烦的。

我并不认同微信官方推荐的做法，倒不是我独辟蹊径，而是 session_key 根本没必要保存在业务服务器 —— 因为它只在验证签名时才被用到。那我们什么时候验证签名呢？就是在获取用户信息的时候。而获取用户信息并不会特别频繁，通常一次会话中不超过一次。那我们不如直接省掉 checkSession 这一步，在小程序会话开始时调用 `wx.login` 然后紧接着调用 `wx.getUserInfo` ，将两者返回的数据一并提交给服务器。如下图：


![](/img/2018/wxapp-login.jpg)

