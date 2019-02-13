---
title: 进击的猫鼬 (2)
date: 2014-11-07 07:00:00
layout: post
style: code
tags:
---

书接[上文](http://www.maintao.com/mongoose-attack-1)。这第二只猫鼬，出自爱尔兰都柏林的一家公司cesanta。

![](/img/2014/mongooses-attack-2_logo.png)

如上所示，Mongoose有两件法宝，第一件是[Mongoose Web Server](http://cesanta.com/mongoose.shtml)，第二件是[LibMongoose](http://cesanta.com/libmongoose.shtml)。由于LibMongoose的使用场景相对较小，我们只讲第一件，也就是怎么用好Mongoose web server。所以本文技术门槛很低，老少皆宜。

日常工作中，经常会有这两个需求：

1. 要在自己的电脑上跑起一个网站，让同事也能访问。
2. 把自己电脑上的资料共享给家人或同事。

先看第一个需求，用技术语言翻译一下，就是在本地运行一个web server。那问题来了，web server哪家强？最先想到的，肯定是著名的nginx、Apache、IIS这些，名气虽大，但用起来不方便。这些大名如雷贯耳的明星产品擅长解决的是更加复杂庞大的问题，而你的小儿科需求，Mongoose完全可以满足。

Mongoose让搭建一个web server简单到什么地步？只需要一步：在网站的根目录下打开Mongoose程序。好吧，如果把Mongoose拷到网站根目录下也算的话，那就是两步。下载Mongoose也算的话就是三步。打开电脑也算的话……我可要警告你，猫鼬是一种很凶猛的动物！

Mongoose是跨平台的，Windows和OS X下使用方法一样，Linux上只有命令行界面，但说实话如此简单的功能要GUI也没啥用。下面的傻瓜教程是在Windows下，其他平台大同小异。

[到这里](http://cesanta.com/mongoose.shtml)下载最新版本的Mongoose，复制到网站根目录下：

![](/img/2014/mongooses-attack-2_directory.png)

其中index.html是网站的主页，不妨来个最简单的：

```html
<html>
<body>
Hello Mongoose
</body>
</html>
```

双击Mongoose可执行程序，会自动用默认浏览器打开这个网页，留意浏览器地址栏中的端口号，是运行在Mongoose默认的8080端口。就这么简单，复制这个网址给你的同事，让ta欣赏一下你搭建的网站，只要你们在同一个局域网。

再来看需求二，怎样把电脑上的资料共享给别人？在自己的机器上跑一个Http Server，让别人来下载就是了。做法同样简单，只要目录下没有index这个页面，Mongoose打开的网页就会列举当前目录下有哪些文件和文件夹。


## 进阶篇 配置文件

Mongoose使用的默认端口号是8080，这样访问你网站的地址就是：

    http://xxx.xxx.xxx.xxx:8080
    
若不写端口号，浏览器会使用默认的80端口，但是Mongoose使用的是8080端口，两个端口对不上怎么办？

还有，我想共享一个目录，但是我不想把Mongoose拷贝进这目录，可以做到吗？

答案是可以的，只需要一个配置文件。如果不在命令行指定一个配置文件，就会在当前目录下寻找默认的mongoose.conf作为配置文件。因此把你的配置都放在当前目录下的mongoose.conf里吧。配置文件样例如下：

    listening_port 80             #端口号，默认8080
    access_log_file a.txt         #访问日志文件，默认没有
    enable_directory_listing no   #是否允许共享目录，默认是yes
    document_root D:\             #所列举目录的根路径
    index_files index.html,a.htm  #当默认不是index.html的时候在这里设置

更多详细配置参考[官方文档](http://cesanta.com/docs/Options.shtml)

Mongoose对Mac的支持要比Windows和Linux好，在Mac上配置工作无需借助配置文件，而是有专门的页面可以设置。在Mac启动Mongoose后，可爱的猫鼬会驻留在menu bar，随时听候你的差遣。

![](/img/2014/mongooses-attack-2_mac.png)

![](/img/2014/mongooses-attack-2_settings.png)

从上面的配置页可以看到，除上面说的几个还有很多好用的配置，例如限制来访的IP地址等，只是我在Windows下验证并不好使，所以就没多提。唉，Windows的待遇竟落得如此不堪。
