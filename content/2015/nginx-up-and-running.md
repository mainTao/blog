---
title: nginx up and running
date: 2015-04-07 07:00:00
layout: post
style: code
tags: 
---

我毕业后的第一份工作就是服务端编程。不过自从离开那个岗位后，基本都在做客户端的开发。最近因为公司业务转型，我又重新做回服务端。捡起老本行，感觉还是很不错的。

从今天起，我在博客上开一个 server up and running 系列，每次介绍一个实用炫酷的服务端工具。既然是 up and running，内容无外乎最基本的安装、配置、使用说明，那不和网上其他的教程一个样了？也许吧，但我争取做得更好，比那些 step by step 的教程多追问几个为什么。

## 如何选择版本

在进入今天的主题之前，有必要谈谈如何选择服务器的操作系统。关于这个话题，之前有过 CentOS 和 Ubuntu 应该选哪一个的论战。如果你选的不是 Ubuntu，那对不起了，走好不送。

服务器上运行的 Ubuntu 最好是一个久经考验的版本，例如我正在用的 Ubuntu 14.04 LTS (Long Time Support)。不要赶时髦追新版本，像什么 Ubuntu 14.10，虽然声称是稳定版，但别的软件对它支持并不好。例如 nginx 就无法在 Ubuntu 14.10 上用 apt-get 安装 mainline 版本（最新版）。LTS 就不存在这个问题。也许以后 nginx 会修复，但至少给了我们一个警示：不要对非 LTS 版本抱有太多幻想。

现在来谈谈为什么操作系统不追新，却要追 nginx 的新版本。其实不止是 nginx， 很多软件都会在新版本上做大幅改进，不用实在太可惜。就算大胆尝鲜出了问题，可以随时装回老版本，没什么大不了。但换操作系统就是大手术了，所有东西都要重新安装配置，简直一场灾难。

看来应该在追新与不折腾之间找到一个平衡点，我找到的平衡点是：

> 操作系统用LTS版本，其他软件大胆用新版本。

## 卸载 nginx

在讲安装 nginx 之前，先来说一说怎样卸载 nginx。为什么要卸载呢？因为你的服务器上可能已经装了一个老版本的 nginx，装新版本之前，可能需要先卸载掉旧的。

卸载 nginx 的命令：

    $ sudo apt-get remove nginx

上面的命令可以卸载掉 nginx，但不会卸载 nginx 的依赖包，如果依赖包不卸载干净，安装新版本可能会报错。但一般来说不着急卸载依赖包，等到报错了再卸载也没问题。卸载依赖包的命令是：

    $ sudo apt-get autoremove nginx

你可能想完全从头再来，连之前的配置文件也不要了，那就把配置文件也删掉：

    $ sudo apt-get purge nginx

执行这步之前要慎重，否则好不容易写好的配置文件就都没了。

## 安装 nginx

安装最新版本的 nginx 有两种方式，一是下载源码自己编译，二是用 apt-get 命令来安装。下载源码编译虽然很酷，但略折腾，要下载整个源码包，解压缩，再 configure ，再 make，速度是个问题。所以更推荐使用 apt-get。

apt-get 会从官方的库里下载软件，但问题是 nginx 的最新版本并不会出现在这个官方库里。那怎么办呢？我们需要告诉 apt-get，嘿，安装 nginx 请用这个源！哪个源呢？在 nginx 的官网上可以找到。

打开 nginx 官网的 [Linux Package](http://nginx.org/en/linux_packages.html) 页面，这个页面包含了各种各样的 Linux 版本，我们只关注 Ubuntu 的部分。Ubuntu 的历史版本有各自的 codename，目前最新的 LTS 版是 14.04，它的 codename 是 trusty，如下：

- 10.04	lucid
- 12.04	precise
- 14.04	trusty
- 14.10	utopic

下一步是要在 apt 资源列表追加 nginx 的官方源：

    $ sudo vi /etc/apt/sources.list
    
安装 stable 版，就在文件末尾添加这两行：

    deb http://nginx.org/packages/ubuntu/ trusty nginx
    deb-src http://nginx.org/packages/ubuntu/ trusty nginx

如果是安装 mainline 版（我，版本帝的选择），就在文件末尾添加这两行：

    deb http://nginx.org/packages/mainline/ubuntu/ trusty nginx
    deb-src http://nginx.org/packages/mainline/ubuntu/ trusty nginx

注意，如果你的 Ubuntu 版本不是 14.04，需将上面两行中的 trusty 替换成相应的 codename。

apt-get 怎么知道我们下载的包是不是原装正品呢？需要用一个签名来验证，首先从 nginx 官网下载这个签名文件：

    $ wget http://nginx.org/keys/nginx_signing.key

光下载不行，还要执行一条命令让 apt 收了它：

    $ sudo apt-key add nginx_signing.key

好了，现在一切就绪。先升级 apt-get 的资源列表，然后安装 nginx：

    $ sudo apt-get update
    $ sudo apt-get install nginx

安装完成！

## 配置 nginx

配置文件在哪？执行命令：

    $ sudo nginx -t

-t 参数表示 test，用来测试 nginx 的配置文件，输出结果可能会是这样：

    nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
    nginx: configuration file /etc/nginx/nginx.conf test is successful

输出结果告诉你配置文件语法正确通过了测试，顺带泄露了配置文件的位置：

    /etc/nginx/nginx.conf

这是全局配置文件，各个站点的配置虽然也可以写在这里，但还是建议单独弄成以 .conf 结尾的配置文件放到 /etc/nginx/conf.d/ 目录下。

至于配置文件的细节，不是一两句能讲完的，网上有的是资料参考。需要提醒一点，网上的资料很多已经过时了，谁让 nginx 发展那么迅速呢。所以建议去看[官方文档](http://nginx.org/en/docs/beginners_guide.html)

nginx 的一大缺点就是官方文档太过简单，连基本的用法都覆盖不了。为化解缺少文档的尴尬，官网上直接用别人写的文章当做教程，打开发现是一个五年前不知哪位写的博客，一些代码早就不是那样了还摆在那，非常具有误导性。

这里介绍两个还算靠谱的教程：

[NGINX 官网的 Tutorial and Admin Guide](http://nginx.com/resources/admin-guide/)
[NGINX TIPS](https://www.scalescale.com/tips/nginx/)

这两个网站都有搜索框，支持全站搜索，找东西方便。

## 运行 nginx 

配置文件搞好，运行就是一行命令的事。如果你安装后还没有改动过配置文件，也是可以运行的，有一个默认的网页。运行 nginx 的命令很简单，就是：

    $ nginx

运行后， nginx 会作为服务跑在后台。服务可以启停，官网上给出了启停的命令，但我不推荐那么做，因为不是很好记。明明 Ubuntu 有统一的启停服务的命令，没必要另搞一套。

    $ sudo service nginx start
    $ sudo service nginx stop
    $ sudo service nginx restart
    
上面三条命令很好看懂，就是启动、停止和重启 nginx。对于其他的后台服务，也可以套用这个模板，只要把 nginx 换成别的，例如 redis。

还有一个比较好用的命令：

    $ sudo service nginx reload

reload 和 restart 有什么区别？

restart 会杀死原来的 master 进程，然后启动一个新的。如果配置文件或哪的有问题，导致启动不起来，那么 nginx 就挂了，直到你想办法把它启动起来为止。

reload 就不会有这问题，reload 不杀死 master 进程，只杀死 worker 进程。配置文件错了顶多就不生效，不影响 nginx 的正常运行，所以可以放心大胆地执行而不用担心服务中断。

## 隐藏 nginx 版本号

不管你用的是哪个版本的 nginx，都有存在漏洞的可能。黑客知道了你的 nginx 版本号，就方便针对这个版本发起攻击。以防万一，还是隐藏掉版本号的好。

nginx 通过改配置文件就可以隐藏版本号。在全局配置文件 /etc/nginx/nginx.conf 里，找到 http 块，加上一行即可。
    
    http {
        server_tokens       off;
    }

改完配置文件后，让 nginx 读取新的配置文件。

    $ nginx -s reload

此时客户端再发请求，返回来的 Response Header 里，Server 的值就只显示 nginx，而没有了版本号。


## nginx 的作用

技术发展到今天，单纯的 web server 地位变得很尴尬，以前还能标榜一下高并发，但如今用 NodeJS 或 Golang 开发的系统天生就擅长高并发，传统的 web server 不再有优势。

nginx 与时俱进，做到了“人无我有，人有我优”，发展到今天已不再是一个单纯的 web server，加入了负载均衡和代理等功能，并不断把性能推向极致。像缓存、压缩、负载均衡这些琐事，通过简单的配置搞定，无需编程。

所以在 web 系统的最外端留一个 nginx，已经成为习惯。当一个 http 请求发来，先到 nginx 手里，由它帮你转发到合适的地方，你的业务系统在那里守候着，待处理完成后将应答交回给 nginx，它视情况做一些后续处理(例如压缩)，最后将应答发送给客户端。

nginx 很好很强大，只是用起来有些麻烦，坑很多的样子，祈祷一切顺利。