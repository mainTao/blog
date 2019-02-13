---
title: 微信小程序中使用 Promise
date: 2016-12-07 07:00:00
layout: post
style: code
---

## 为什么要用 Promise

微信小程序刚上来给人感觉是简单轻量，业务想必也不会多复杂。所以刚开始做微信小程序的时候，没想用 Promise，觉得 callback 就能胜任啊反正业务简单。

结果刚一上来，仅为获得用户的微信 ID 就要写四层回调，懵逼了。。。

为什么要四层回调，分析一下：

1. 调微信登录接口 wx.login
2. 拿第1步返回的 code 去调用自己的接口，拿 3rd_session
3. 调获取用户信息接口 wx.getUserInfo
4. 拿到第2步返回的 3rd_session 和第3步返回的密文，一起提交给自己服务器，服务器解密后得到 unionId（微信系统内的用户ID）

这还没算把 3rd_session 存储到 storage 的一层回调，因为 wx.setStorage 也是异步的。当然微信还提供了一个同步方法 wx.setStorageSync，当已经嵌套了四层回调之后，见到一个能同步调的 API，身处回调地狱中的猿们简直感动得落泪。

无奈之下，祭出 Promise 来止痛。

## 怎样用 Promise

微信小程序的 API，绝大多数都是异步回调的。wx.functionName 这种形式的 API，传入的是一个对象，包含了 success, fail, complete 这几个回调函数。我要做的就是让这些 API 返回一个 promise，后面接上 then 和 catch，而用不着传入 success 和 fail 这些回调函数。

改动原有的 API 造成的破坏太大，我在 wx 下面挂载了一个 pro 对象，表示 promise 的意思，然后在 wx.pro 下面根据需要加入同名的 wx API 方法。举例来说，原来的 wx.request 变成 wx.pro.request。这样做基于以下几点考虑：

1. 放在 wx.pro 因为 wx 是个全局变量，随处可用
2. 关于命名，最开始是叫 wx.p，但是很快发现一个问题，就是很容易把 wx.p 写错成 wx.q 而且肉眼不好识别。相比之下 pro 一旦拼写错就特别显眼，字母太少反倒容易拼错。
3. 不像 bluebird 的 promisifyAll 一样对所有的函数在原有名称上加一个 Async 后缀。我一直觉得这样命名不妥，因为人家本来就是异步的，处理过之后并不是将同步变异步。而且还有诸如 wx.setStorageSync 这种同步方法，和 wx.setStorageAsync 简直天生一对。


我选择的三方库是 [es6-promise](https://github.com/stefanpenner/es6-promise)。引入第三方库的时候要特别注意，因为微信小程序不支持 DOM，而某些 Promise 库里有 DOM 相关的代码，例如 [bluebird](http://bluebirdjs.com/docs/getting-started.html)，我就掉进这个坑里了。在调试工具和 iPhone 上测试都没问题，一到 Android 就跪了。而且从错误信息完全看不出原因。

## 上代码

wx-pro.js 文件：

```js
const Promise = require('../lib/es6-promise').Promise

function promisify() {
  wx.pro = {} // wx.pro 下面挂载着返回 promise 的 wx.API

  // 普通的要转换的函数
  const functionNames = [
    'login',
    'getUserInfo',
    'navigateTo',
    'checkSession',
    'getStorageInfo',
    'removeStorage',
    'clearStorage',
    'getNetworkType',
    'getSystemInfo',
  ]

  functionNames.forEach(fnName => {
    wx.pro[fnName] = (obj = {}) => {
      return new Promise((resolve, reject) => {
        obj.success = function (res) {
          console.log(`wx.${fnName} success`, res)
          resolve(res)
        }
        obj.fail = function (err) {
          console.error(`wx.${fnName} fail`, err)
          reject(err)
        }
        wx[fnName](obj)
      })
    }
  })

  // 特殊改造的函数

  wx.pro.getStorage = key => {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        success: res => {
          resolve(res.data) // unwrap data
        },
        fail: err => {
          resolve() // not reject, resolve undefined
        }
      })
    })
  }

  wx.pro.setStorage = (key, value) => {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: key,
        data: value,
        success: res => {
          resolve(value) // 将数据返回
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }

  wx.pro.request = options => {
    if (options.toast) {
      wx.showToast({
        title: options.toast.title || '加载中',
        icon: 'loading'
      })
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url: options.url,
        method: options.method || 'GET',
        data: options.data,
        success: res => {
          if (res.statusCode >= 400) {
            console.error('wx.request fail [business]', options, res.statusCode, res.data)
            reject(res)
          }
          else {
            console.log('wx.request success', options, res.data)
            resolve(res.data) // unwrap data
          }
        },
        fail: err => {
          console.error('wx.request fail [network]', options, err)
          reject(err)
        }
      })
    })

  }
}

promisify()

module.exports = Promise
```

在启动文件 app.js 引入上面的 wx-pro.js，就会自动把函数注入进 wx.pro，要注入的函数名在 functionNames 这个数组中，根据自身需要来选择。

注意有三个函数我优化了一下，分别是 setStorage、getStorage 和 request。重点说一下 request，微信的 wx.request 即便服务器返回的状态码是 4XX 5XX，仍然当做成功而不是失败，也就是说 wx.request 的 fail 只处理网络错误，即没有收到服务器应答才算做错误，个人认为这和 HTTP 规范在语义上有不匹配，而且要写额外的代码来辨别成功失败。

下面是 request 的使用举例：

```js
wx.pro.request({
  url: 'xxx',
  method: 'GET',
  data: {
    // 服务器返回 2XX、3XX
  }
})
.then(data => {
  // 2XX, 3XX
})
.catch(err => {
  // 网络错误、或服务器返回 4XX、5XX
})
```

