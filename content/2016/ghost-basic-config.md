---
title: Ghost 基本配置
date: 2016-07-07 07:00:00
layout: post
style: code
---

Ghost 的官网上讲了不少配置相关的，这里有[文档](http://support.ghost.org/config/)，但我读完感觉废话偏多（可能是历史遗留较多），要避的坑也没有指出来，另外邮件配置那块拿谷歌亚马逊的邮件服务举例显然不符合我国国情。下面我整了一份接地气的配置指南。

Ghost 的配置文件，是位于安装目录下的 config.js。位于根部也是最大的 config 对象里分了几个部分，我们只关注 production 这部分，它是真实的生产环境的配置。我们把范围锁定在 production 块，而在这个小块中，只需关注其中三项：

- [url](#url)
- [mail](#mail)
- [database](#database)

下面逐个来解读。

## url

url 这个参数是博客的完整地址，包括协议前缀 http 或 https，官网上其他废话都不用看。

## mail:

邮箱目前唯一的用处是给用户发送找回密码的邮件。官网用[一整页](https://endbetter.org/)来讲邮箱配置，没啥卵用。

做一个正儿八经的博客，最好有一个专有域名。再配一个以专有域名结尾的邮箱，立马就高大上了。

举个真实的例子（仅隐藏密码）：

```javascript
mail : {  
    transport: 'SMTP',
    from: '"End Better" <admin@endbetter.org>', // 姓名和发件人
    options: {
        host: 'smtp.qq.com', // SMTP服务器地址，参考各邮箱的说明
        secureConnection: true, // true就对了
        port: 465, // 端口号，参考各邮箱的说明
        auth: {
            user: 'admin@endbetter.org', // 发件账号必须和 from 的发件人一致
            pass: '邮箱密码'
        }
    }
}
```

上面是我的 QQ 域名邮箱。QQ 域名邮箱其实是 QQ 个人邮箱的一个别名，只要拥有一个域名和一个 QQ 号，就能免费申请 QQ 域名邮箱。同一个域名下可绑定多达200个邮箱账号，但限制这200个邮箱账号必须对应200个不同的 QQ 号，即不允许 a@example.com 和 b@example.com 绑定到同一个 QQ 号码上。

QQ 域名邮箱还有个好处：一个 QQ 号可以同时绑定多个域名的邮箱，比如我同时是两个网站 a.com 和 b.com 的管理员，那么完全可以同时把 admin@a.com 和 admin@b.com 两个邮箱都绑定到我的 QQ 个人邮箱上。这样无论哪个邮箱的来信都不会错过，统一管理，非常方便。 

下图是同一个 QQ 邮箱同时绑定多个域名邮箱的情况：
![](/img/2016/ghost-basic-config_domain-mailbox.png)

QQ 域名邮箱本质上是个人邮箱，除此之外还有众多企业邮箱可供选择，均能满足自有域名邮箱后缀的装逼需求。下面列举几种常见的：

QQ 域名邮箱：smtp.qq.com 端口 465
腾讯企业邮箱：smtp.exmail.qq.com 端口 465
阿里企业邮箱：smtp.mxhichina.com 端口 465
网易企业邮箱：smtp.ym.163.com  端口 994

## database

Ghost 默认使用 sqlite 数据库，这是一个文件数据库，好处是不用做任何配置拿来即用，坏处是查看数据不方便。

下面以最为常用的 MySQL 数据库为例，来看看配置怎么写：

```javascript
database: {
    client: 'mysql',
    connection: {
        host     : '地址',
        user     : '用户名',
        password : '密码',
        database : '数据库名',
        charset  : 'utf8mb4' // 建表时
    }
}
```

首次运行 Ghost 的时候，Ghost 会自动建表并写入一些初始数据，因此在首次运行 Ghost 之前要确保 MySQL 服务运行着，并事先创建好了数据库。

为了兼容 emoji，我们把 charset 设置为 utf8mb4，注意这是首次运行时的写法。因为首次运行执行建表语句，需要 charset 是 utf8mb4。待建表完成后，需要把 charset 改为 UTF8MB4_GENERAL_CI：

```javascript
database: {
    client: 'mysql',
    connection: {
        host     : '地址',
        user     : '用户名',
        password : '密码',
        database : '数据库名',
        charset  : 'UTF8MB4_GENERAL_CI' // 建表后
    }
}
```

然后重新启动 Ghost，自此往数据库里插入 emoji 字符就不会有问题了。MySQL 坑终于填平。
