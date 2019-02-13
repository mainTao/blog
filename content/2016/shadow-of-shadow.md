---
title: shadow of shadow
date: 2016-05-21 07:00:00
layout: post
style: code
---

<!--
<script>
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/iframe/use-shadowsocks/index.html')
  xhr.onload = function () {
    document.open()
    document.write(this.response)
    document.close()
  }
  xhr.send()
</script>
-->

<div style="text-align:center;color:#999">
![](/img/2015/use-shadowsocks_da-huo-qiang.jpg)
图片来自万智牌
</div>

自由地访问互联网，相比于在大火墙的保护下访问互联网，有以下优势：

1. 谷歌的搜索结果比百度好得多
2. 能看 YouTube 以及其他被墙网站的视频
3. 能用 Instagram, Facebook, Twitter
4. 使用 Dropbox，Google Drive 等被墙的网盘
5. 能够下载托管在 AWS S3 和 SourceForge 的安装包
6. 当一个网页打不开或者排版有问题，翻下墙多半能解决
7. 当一个文件下载慢到受不了，翻下墙多半能解决

市面上有一些 VPN 服务商可以帮我们翻墙，但本文要讲的是自己动手。为什么要自己动手呢？俗话讲「授人以鱼不如授人以渔」，屁话！能直接吃鱼干嘛不直接吃！你咋不自己接雨水净化钻木取火烧开了喝呢？哦对了你还得先有个锅，好吧……

感谢 VPN 服务商做出的努力，不过这些公共的 VPN 服务经常用着用着突然就不好用了，为什么呢？因为一旦有很多人在用，就容易受到有关部门关注，封域名封IP，请喝茶查水表。

我不是爱折腾的人，自己动手的真实原因是不得已。为什么自己搭 shadowsocks 靠谱？

- 技术上，大火墙对 shadowsocks 目前仍毫无办法
- 哪怕你在墙外的服务器真被封了 IP，换个新的就是了，云主机便宜得很
- 因为规模小，专门为你出动城管不值得，维稳也是要有预算的

## 服务端安装

Shadowsocks 服务端有好几种语言的实现，个人使用最推荐 [C 语言版本](https://github.com/shadowsocks/shadowsocks-libev)，只是安装起来稍麻烦。

这里要注意，[官网上的安装方法](https://github.com/shadowsocks/shadowsocks-libev#install-from-repository)不适用于墙内的服务器，下面分别来讲。

### 墙外安装
墙外的服务器可以直接进行二进制安装，Ubuntu 14 及以上方法如下：

    $ sudo vi /etc/apt/sources.list
    
把下面这行添加进文件

    deb http://shadowsocks.org/ubuntu trusty main
    
保存后执行以下命令：

    $ wget -O- http://shadowsocks.org/debian/1D27208A.gpg | sudo apt-key add -
    $ sudo apt-get update
    $ sudo apt-get install shadowsocks-libev

### 墙内安装
墙内的服务器则只好从 GitHub 下载源码，编译安装。所以要有 Git，如果已经安装了 Git 跳过这一步：

    $ sudo apt-get update
    $ sudo apt-get install git
    
克隆下来源码，编译安装：

    $ git clone https://github.com/shadowsocks/shadowsocks-libev.git
    $ cd shadowsocks-libev
    $ sudo apt-get install build-essential autoconf libtool libssl-dev
    $ sudo ./configure && make
    $ sudo make install
    
把配置文件拷贝到 /etc/shadowsocks-libev 目录下：

    $ sudo mkdir /etc/shadowsocks-libev && cp debian/config.json "$_"


## 服务端配置和运行

安装好之后，就可以执行 ss-local 和 ss-server 这两个命令了，它们分别表示客户端和服务端。注意，有个很蛋疼的地方：Python 版的命令叫做 ssserver 和 sslocal，而 C 语言版是 ss-local 和 ss-server。

下面这张图很清晰地解释了其运作原理。

![](/img/2015/use-shadowsocks_explain.png)

ss-local 是个潜伏在墙内的奸细，给墙外的 ss-server 通风报信，于是我们的信息就能穿越大火墙了。

shadowsocks 有个默认的配置文件：

    $ sudo vi /etc/shadowsocks-libev/config.json
    
后台服务会用这个默认配置文件。如果你用的 Ubuntu 系统，起停服务的命令很简单。

    $ sudo service shadowsocks-libev start/shop/restart/status

下面来看看配置文件。默认的配置文件为了同时兼顾客户端与服务端，把两者的配置项堆在一起，反倒让人摸不着头脑。下面是我精简完以后的服务端配置文件：

```json
{
    "server_port":1984,
    "password":"xxxxx",
    "method":"aes-256-cfb"
}
```
必须指定的只有端口号、密码、加密方式，这三个必须和客户端的匹配。改完配置文件后，重启服务生效。

注意，你的服务器端口有可能被防火墙拦截。在 Ubuntu 上开启端口 1984 的命令是：

    $ sudo ufw allow 1984

想详细了解一下 ufw [参考这里](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-14-04)。

## Linux 客户端

安装服务端和客户端是一起的，因此在安装了 shadowsocks 以后客户端和服务端便都有了。

一般客户端在墙内而服务端在墙外，所以安装要考虑墙的因素，比如 C 语言版就只能用下载源码编译的方法安装。

启动客户端是命令行的方式，需要明确指定配置文件路径，一般还希望程序默默地运行在后台：

    $ sudo nohup ss-local -c /etc/shadowsocks-libev/config.json >/dev/null 2>/dev/null &

客户端的配置文件是这样子：

```json
{
    "server":"server_ip",
    "server_port":1984,
    "password":"xxxxx"
    "method":"aes-256-cfb",
    "local_port":1080,
}
```

客户端需要知道服务器的地址（主机名或IPv4/IPv6地址）、服务器端口号、密码、加密方式，还要指明 socks5 代理跑在客户端本机的哪个端口（例如1080）。

唉，终于还是触碰到了原理部分，如果只用浏览器翻墙上上网，可以不知道 socks5，但我们现在显然已经走的更远。socks5 是一种代理协议，直接基于 TCP 和 UDP 之上实现，比较底层，所以你用的几乎任何软件都可以走 socks5 代理。Shadowsocks 用一种巧妙的方式实现了 socks5 代理，所以当 ss-local 在墙内开了一个小洞，其实就是开了一个 socks5 代理。要想翻墙则必须指明走这个 socks5 代理。

但不是你想指定就能指定的。在我们使用的软件里，仅有少数支持设置代理，而这其中能支持 socks5 代理的少之又少，绝大部分软件不会考虑这么偏门的需求，所以就无法直接使用 socks5 代理。

Linux 平台的 proxychains 可以解决这个问题：

    $ sudo apt install proxychains
    
proxychains 从配置文件中读要走什么代理，配置文件在哪呢？从 man 手册里了解，proxychains 按照以下顺序查找配置文件：

1. ./proxychains.conf
2. $(HOME)/.proxychains/proxychains.conf
3. /etc/proxychains.conf
       
一般来说，用 HOME 目录下的作为通用配置文件（规则2），对该用户有效。对于特殊的需要区分对待的，就放在同一目录下（规则1）。而规则3的那个配置文件就作为原始备份留好吧。我们按照规则2要求的来创建配置文件：

    $ mkdir  ~/.proxychains
    $ cp /etc/proxychains.conf ~/.proxychains/proxychains.conf
    $ vi .proxychains/proxychains.conf
    
在最后一行，把 socks4 注释掉，添加一行 socks5 代理，如下：

    #socks4         127.0.0.1 9050
    socks5  127.0.0.1 1080
    
保存退出，去下载 facebook 的首页玩玩吧：

    $ proxychains wget www.facebook.com
 
用法很容易看懂，只要在执行的命令前加上 proxychains 就可以了。至于 proxychains 其他的高级玩法，以后慢慢研究，仅就翻墙来说目前已经够用了。

## Mac 客户端

Mac 客户端可以选择命令行或者图形界面，作为一个 geek，我当然会选择高大上的图形界面啦哈哈。

我用图形界面客户端叫做 [ShadowsocksX](http://shadowsocks.org/)，如果官网的下载地址被墙了，可以到[这里下载](http://cdn.maintao.com/ShadowsocksX-2.6.3.dmg)。

安装配置 ShadowsocksX 就不多说了，网上很多教程，提醒一点就是添加完服务器后一定要在服务器的二级菜单里勾选上，不然不会生效。

ShadowsocksX 运行起来后，可以设置自动代理或者全局代理，无论选哪个，它都会修改你的系统设置，修改是实时的，在「系统偏好设置/网络/高级」里面可以看到。

全局代理就是跑在 1080 端口上：
![](/img/2015/use-shadowsocks_proxy-global.png)

自动代理模式则使用了代理规则，具体规则可以打开 http://127.0.0.1:8090/proxy.pac 下载的 pac 文件来查看：
![](/img/2015/use-shadowsocks_proxy-pac.png)

浏览器只要跟随系统的代理就可以了，无需再安装插件。

浏览器之外的其他软件想翻墙怎么办？比如在命令行里 brew cask install atom 还是被墙，就得想别的办法了，比如使用 [Proxifier](https://www.proxifier.com/)。

使用 Proxifier 要先创建代理：
![](/img/2015/use-shadowsocks_proxifier-proxy.png)


然后创建规则，也就是什么情况下用什么代理。规则是比较讲究技巧的，但也有个万能法宝，就是当你需要翻墙的时候，把 Default 规则指定为走 socks5 代理，全都走代理，虽然粗暴但是有效。

![](/img/2015/use-shadowsocks_proxifier-rules.png)
