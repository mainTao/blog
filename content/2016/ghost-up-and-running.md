---
title: Ghost up and running
date: 2016-06-28 07:00:00
layout: post
style: code
---

博客这些年来衰退得很厉害，社区在这方面的投入也大不如前。如果非要挑一个的话，Ghost 也许是不错的选择。本文是一篇入门指引，旨在一步一步把 Ghost 跑起来。

本文篇幅有限，如遇问题最好的参考还是[官方文档](https://ghost.org/developers/)。

## 安装 Node.js 和 cnpm

注意，上来就有坑！现在 Node.js 版本已经升级到了 6.x.x 但是 Ghost 依然只支持到 4.2.0 以上的 LTS 版本，具体能兼容哪些版本最好还是看看[官方的说法](http://support.ghost.org/supported-node-versions/)。

这里顺带科普一下 npm 的版本号，我没有那么幸运在一开始就看到 [Supported Node Versions](http://support.ghost.org/supported-node-versions) 而是安装报错后才发觉的。报错说 Ghost 向上支持到 ^4.2.0，这是什么意思呢？它和 ~4.2.0 有什么区别呢？

举例说明：

^4.2.0：表示大于等于4.2.0，但主版本号不能变
- 符合的：4.2.0, 4.2.1, 4.5.0
- 不符的：4.1.0, 3.0.0, 5.0.0

~4.2.0：表示大于等于4.2.0，但前两个数都不能变
- 符合的：4.2.0, 4.2.1, 4.2.10
- 不符的：4.1.0, 4.3.0, 5.0.0

目前符合条件的最新的 Node 版本是 4.4.6，符合 ^4.2.0 的要求。

安装 Node.js 可以参考 [Node.js up and running](http://www.maintao.com/2015/nodejs-up-and-running/)，可把原文中的版本号 0.12.2 替换成当前最新的 4.4.6。

Ghost 需要用 npm 来安装依赖，服务器如果在国外，npm 速度搜搜的，但是在国内最好还是用 cnpm，磨刀不误砍柴工。安装 cnpm 的方法可以参考[这里](http://www.maintao.com/2015/internet-chinese-goods/#taobao-npm-镜像)。

如果安装好了 cnpm，可将下文安装命令中出现的所有 npm 都改成 cnpm，以获得更好的速度。

## 安装 Ghost

第一步，下载：

    $ curl -L http://ghost.org/zip/ghost-latest.zip -o ghost.zip

第二步，解压：

    $ unzip -uo ghost.zip -d /var/www/ghost
    
如果想把 Ghost 安装到别的目录也可以，这里用默认的 /var/www/ghost
    
第三步，安装依赖：

进入解压的目录：

    $ cd /var/www/ghost
    
安装依赖包：
   
    $ npm install --production
     
这一步有可能出现安装失败的提示，最有可能就是上文提到的 Node.js 版本不对。另外，好奇的你可能想知道 --production 这个参数有什么用？不加的话会有什么后果？官网上说，不加也没事，只不过会给你安装一大堆没用的包，这些包是给想改动 Ghost 内核的开发者准备的，大多数人压根用不到，所以还是建议加上 --production。

## 配置文件

配置文件位于安装目录下，文件名 config.js，官网上有[全面的文档](http://support.ghost.org/config/)，不用改配置文件就能跑起来。关于配置文件，以后有机会再详细解读。

## 用 PM2 把它跑起来

官网上用 npm start 默认的启动方式不值得推荐。PM2 或 forever 能让进程持久地运行，正是我们需要的。

去年曾在博文里[介绍过 forever](http://www.maintao.com/2015/nodejs-up-and-running/#使用-forever)，不再赘述。这次我们用一用比 forever 更强大的 PM2。

首先是安装：

    $ sudo npm install pm2 -g
    
在安装目录 /var/www/ghost，用 PM2 启动 Ghost：   
   
    $ NODE_ENV=production pm2 start index.js --name "ghost"

NODE_ENV=production 是指定环境变量，index.js 是 Ghost 的启动文件。

启动后 PM2 会维护一个列表，记录了当前用户用 PM2 启动的所有 Node.js 程序。pm2 list 命令能输出这个列表，而参数 --name "ghost" 正是给列表中的进程一个名字，以方便辨识。

    $ pm2 list
    
重启：

    $ pm2 restart ghost

停止：

    $ pm2 stop ghost
    
停止后依然会保留在 PM2 维护的列表中，只是状态变成了 stopped，此时 start 和 restart 都可以重新启动它。如果要从列表中删掉，则需要用到 delete 命令：

    $ pm2 delete ghost
    
    
## 反向代理

Ghost 默认运行在 2368 端口，可以在配置文件里改端口号但没啥必要。Ghost 对外不允许直接通过端口号访问，也就是说只有 127.0.0.1:2368 才是可访问的。那么就需要通过反向代理，以 Nginx 为例，配置文件中，在对应的 server 块里加上 proxy_pass 指向 2368 端口。

    server{
        ...

         location / {
            proxy_pass http://localhost:2368;
         }
    }

