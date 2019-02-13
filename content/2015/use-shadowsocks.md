---
title: 科学上网，我用 shadowsocks
date: 2015-05-21 07:00:00
layout: post
style: code
tags: 
---

## 前言碎语

两年多以前，我在博客园（当时还是很有名的 IT 技术社区）发了一篇教翻墙的文章。因为标题中带有翻墙二字，管理员把它撤下首页，并好心发邮件劝我遵守相关法律。

在别人开办的网站上发文章，就像在别人家中做客，注意言行得当，不要给主人添麻烦。所以一收到管理员的邮件，我立刻回邮件道歉，将原文标题里的翻墙二字去掉，改为[《goagent 使用教程》](http://www.cnblogs.com/dc10101/archive/2013/02/16/2913450.html)。

估计在翻墙的程序员当中，我算是认错态度很诚恳的了。不过从此以后，我再也没有在博客园写过文章。

GoAgent 开始还很好用。不过后来就断断续续地不灵了。那时已经对翻墙有了依赖，于是花钱买了[云梯 VPN](https://www.ytvpn.com/)的服务，效果的确好一些，但也有不爽的地方。首先是那些本不需要翻墙的流量也都走 VPN 反倒拖慢了速度。这样就不得不在需要翻墙的时候连上 VPN（有时仅仅是为了用一下 Google），不需要的时候再断开。这样频繁连上断开连上断开，QQ 什么的一断网就蹦出来，好热闹的。每次连接 VPN 都需要一段等待时间，很考验耐心。

云梯 VPN 当时号称国内第一，即便如此也不是每次都能连上。后来渐渐到了要拼人品才能连上的地步。再后来终于有一天，无论我如何努力都连不上了。我想，它可能是被墙了。

## 自己动手，丰衣足食

GFW (Great Fire Wall) 强大与否，往小了说关系到青少年的健康成长，往大了说关系到中华民族的团结稳定，呵呵，所以 GFW 的升级必是长期持久、不可动摇的。几乎可以肯定，只要树大招风被盯上了，就难逃被墙的命运。所以翻墙这事，还是低调一点、小众一点的好。

去年11月的时候，我把电脑换成了 Mac，趁这个机会顺道把翻墙工具也换了，于是发现了 shadowsocks。用 shadowsocks 比用 VPN 多这么几点好处：

1. 不用花钱（但要在境外有服务器哦）
2. 需要翻墙的时候才翻墙，不影响访问国内网站的速度
3. 不用老连接、断开、连接、断开

当然 shadowsocks 也有不好的地方，你不能和过去一样，把等待连接 VPN 的时间用来休息眼睛了。因为现在你不需要等待。

## shadowsocks 服务端安装

下面说说怎么在 ubuntu 上安装 shadowsocks 的服务端。

虽然 shadowsocks 的官网已经被墙了，不过 GitHub 上一搜一大片，所以只要 GitHub 不被墙，这东西装起来就很方便。目前 shadowsocks 有好几种语言的实现，最可靠的应该是 Python 版的，历史最悠久，更新也很频繁。但我接下来要介绍的是用 C 实现的，它占资源最小，底层用了 libev 使得它非常高效。对于一小部分不求最好但求最酷的有洁癖的程序员来说，C 版本是不二之选。

    $ sudo apt-get update
    $ sudo apt-get install git
    $ git clone https://github.com/shadowsocks/shadowsocks-libev.git
    $ cd shadowsocks-libev
    $ sudo apt-get install build-essential autoconf libtool libssl-dev
    $ sudo ./configure && make
    $ sudo make install

C 版本的安装还挺麻烦的，因为是从源码编译，就免不了下载源码和一堆依赖库，花时间等待编译完成。安装完的可执行文件是 ss-server，可以在命令行指定参数启动，但一般都是用配置文件。新建一个配置文件：

    $ sudo vim /etc/shadowsocks.json

内容如下：
```json
{
    "server": "0.0.0.0",
    "server_port": 443,
    "local_address": "127.0.0.1",
    "local_port": 10101,
    "password": "www.maintao.com",
    "timeout": 60,
    "method": "aes-256-cfb",
    "fast_open": false,
    "workers": 1
}
```

上面这一大坨配置，其实只有两项需要客户端与服务端一致，一个是 password，总不能谁都可以用。另一个是 server_port，总得知道要连服务器的哪个端口吧。配置文件写好后，用 -c 选项指定配置文件路径，就可以从配置文件启动了。

    #运行在前台
    $ sudo ss-server -c /etc/shadowsocks.json

    #运行在后台
    $ sudo ss-server -c /etc/shadowsocks.json >/dev/null 2>/dev/null &

这种运行在后台的方法有点挫，要是修改了配置文件需要重启，只好先 kill 掉进程。 这一点上 Python 版显然做得更好，start stop 什么的命令都有。希望 C 语言版的后续能跟上。

## 客户端配置

下载客户端请看这里：[https://shadowsocks.com/client.html](https://shadowsocks.com/client.html)

我很惊讶这个网站竟然没有被墙，估计快了。客户端的设置没什么技术含量，网上有大量文章，这里就不多说了。
