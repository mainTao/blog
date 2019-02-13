---
title: Node.js up and running
date: 2015-05-14 07:00:00
layout: post
style: code
tags: 
---

![](/img/2015/nodejs-up-and-running_logo.png)

Node.js 我很早就在关注，如今它已摆脱了起初的青涩，成为了 web 开发的主力之一。

一项技术一旦成为主流，就会被要求稳定。稳定压倒一切。所以 nodeJS 的发展放慢了下来。一些狂热的开发者对此不满，拉了一个分支出来，叫做 io.js，带来大量的新特性就不多提了。作为一个 web 开发者，稳定虽不能说压倒一切吧，但也绝对是重中之重。io.js 的优秀特性一定会被 Node.js 吸纳进来，不用太着急，只管坐等升级。

本文就简单讲一讲 Node.js 的安装以及让 Node.js 保持运行的工具 forever。

## 安装 Node.js

在 ubuntu 服务器上安装一般有这么三种方式：

1. 用系统的包管理器 apt-get 下载安装
2. 下载源码编译、安装
3. 下载可执行文件、安装

在 server up and running 系列的前两篇，分别用过了前两种方式。其中[《nginx up and running》](/2015/nginx-up-and-running)使用了包管理工具下载安装，[《redis up and running》](/2015/redis-up-and-running)
则是下载源码编译安装。本文我们来试试第三种，下载可执行文件安装。

安装 Node.js 最好的方式我认为正是这种。因为 apt-get 安装的 Node.js 有个奇葩的地方，它的命令不是 node，而是 nodejs。尽管你可以用变通的手段解决它，但不爽啊，而且还有一处更不爽的，就是通过 apt-get 安装的 Node.js 不是最新版本。

想用最新版本，就去[官网](https://nodejs.org/download/)下载二进制文件。

![](/img/2015/nodejs-up-and-running_download-bin.png)

拿到地址后，把包下载下来：

    $ wget http://nodejs.org/dist/v0.12.2/node-v0.12.2-linux-x64.tar.gz

下载完成后，解压：

    $ tar xzf node-v0.12.2-linux-x64.tar.gz

在当前目录下解压后得到文件夹 node-v0.12.2-linux-x64，其中有一个 bin 目录，里面有我们需要的两个可执行文件 node 和 npm。

你可以进到这个目录里执行 node 和 npm 命令，但出了这个目录就找不到了。为了在 其他地方 也能找到，我们把它设置进 PATH 环境变量。可以把解压之后 node-v0.12.2-linux-x64/bin 目录直接设置进 PATH，但这样有个问题，当你要安装新版本的 Node.js，目录名不再是 node-v0.12.2-linux-x64 了，就要重新修改 PATH 环境变量。

一般我们认为修改环境变量不是个好办法，一旦退出 shell 就失效了，就算修改了 profile 或者 .bashrc 文件让它下次自动生效，那还得等下次，已经登录进来的其他终端不能立即生效。更好的做法是不轻易改动环境变量，而用修改软链接的方式达到同样目的。

    $ sudo cp -rp node-v0.12.2-linux-x64 /usr/local/

拷贝解压后的目录 node-v0.12.2-linux-x64 到 /usr/local 目录下，这样做的目的是把二进制文件放在相对牢靠的位置，放在别处就怕哪天手一抖给删了。在目录上保留版本号，万一有问题方便切换版本。

    $ sudo unlink /usr/local/node  # 如果之前设置过链接，先移除掉
    $ sudo ln -s /usr/local/node-v0.12.2-linux-x64 /usr/local/node

做一个软链接，用 /usr/local/node 表示要用的 Node.js 版本的目录，就可以忽略目录中的版本号带来的影响。这一步的目的是让环境变量的值固定，就不用每次换版本去改环境变量了。

为了让环境变量以后都生效，在 profile 文件中添加一行：

    $ vim /etc/profile

    export PATH="$PATH:/usr/local/node/bin"

以后换了版本怎么办呢？只需要再做一次 ln，把软链接指向新版本的目录就可以了，立即生效。


##  使用 forever

Node.js 最大的用途就是做 web server，但悲催的是，如果你像下面这样运行：

    $ node app.js

一旦关闭终端，进程就会退出。可总不能一直开着终端吧，forever 应运而生。

首先，用 npm 安装 forever：

    $ npm install forever -g

[forever](https://github.com/foreverjs/forever) 的最大作用就是保持脚本运行，如果程序遇到异常退出了，forever 会将它重新启动起来。

    $ forever start app.js

这条命令让 app.js 在后台运行。停止运行只需把 start 替换成 stop，重启是 restart。

Node.js 和 PHP 不同，若改动了代码必须重启才能生效，所以 restart 会是一个比较常用的命令。

若你运行着好几个由 forever 启动的进程，想要查看具体都有哪些，可以用 list 命令：

    $ forever list

后台服务打 log 再常见不过了，运行在前台会直接打到控制台，forever 运行在后台的进程把 log 打到哪去了呢？执行 list 命令也会列出日志文件的位置。

要注意一点，forever 默认输出的 log 文件是带颜色的，如果用 vim 直接打开会看到 ^[[32m 这样的字符，有碍观瞻。用 cat 或 tail 命令观察日志就不会有这个问题了，而且还有颜色高亮。

如果 list 列出的脚本比较多，想一下子重启全部，有办法吗？

    $ forever restartall

同样，startall 和 stopall 也是支持的。

forever 的配置文件是 .forever/config.json

```json
{
  "root": "/root/.forever",
  "pidPath": "/root/.forever/pids",
  "sockPath": "/root/.forever/sock",
  "loglength": 100,
  "logstream": false,
  "columns": [
    "uid",
    "command",
    "script",
    "forever",
    "pid",
    "id",
    "logfile",
    "uptime"
  ]
}
```

上面 columns 里装的是什么呢？是运行 forever list 命令所显示的列，并不是日志文件里的列。还有一点很费解的是 loglength，它其实没有什么用，只有在你用 forever logs 命令查看某个文件的时候，会影响打印出来的日志行数。但是 forever logs 命令实在太鸡肋了，不如用 Linux 自带的 tail 命令：

    $ tail <文件名> -n 20
    输出末尾 20 行（默认是 10 行）

    $ tail <文件名> -n 20 -f
    输出末尾 20 行并持续跟踪

要想清掉日志文件怎么办呢，除了用 rm 删除日志文件之外，还有个更简便的命令：

    $ forever cleanlogs

使用这个命令要小心，因为它会清除 forever 所有的日志文件，如果只想清掉某一个应用的日志，不要使用它。另外当程序还在运行的时候，它不起作用，stop 之后再执行才有用。