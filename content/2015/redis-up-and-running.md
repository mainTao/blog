---
title: redis up and running
date: 2015-04-14 07:00:00
layout: post
style: code
tags: 
---

![](/img/2015/redis-up-and-running_logo.png)

很多人开始接触 redis，是把它当缓存用，替代 Memcache。其实 redis 的作用远不止于作缓存，它在后端的角色更像是内存，负责记下所有状态。

redis 在中国这么火，我觉得和 PHP 的流行有关。PHP 处理完一次请求后内存就释放了，想要保存状态只得借助其他工具。借助什么工具呢，很多人干脆就记在数据库里，每次读写一个状态值都要读写数据库，简直了~

能把数据保留在内存的，例如 NodeJS，就不需要 redis 了？不然。NodeJS 不适合存储大量对象，一是因为 V8 引擎能使用的内存受限，而且将大量内存中的对象会降低 V8 垃圾回收的效率。二是因为用了 redis 可以把其他机器的内存也拿来用，你可以让 redis 同时运行在多台机器上，它们的内存就都是你的了，虽然会有一点时间花在网络传输上，但大多情况下是可以接受的。

redis 除了帮助你方便地存取值，还实现了一些常用数据结构，以及数据持久化、“订阅-发布”等功能，省得自己再造轮子了。

下面就来讲一讲 redis 在 Ubuntu 上的安装和配置。


## 下载、编译 redis 源码

下载源码包，解压：

    $ wget http://download.redis.io/redis-stable.tar.gz
    $ tar xvzf redis-stable.tar.gz

进入 redis-stable 目录，如无特殊说明，后续的操作都在此目录下执行。：    

    $ cd redis-stable

编译源码：

    $ make
    
redis 的代码量不大，下载和编译起来都很快。编译完成后，会在当前目录下生产可执行文件。

拷贝可执行文件，让redis-server和redis-cli命令能被shell找到

    $ sudo cp src/redis-server /usr/local/bin/
    $ sudo cp src/redis-cli /usr/local/bin/

    
## The Hard Way

redis 的安装有手动和自动两种，但要明白其背后原理，手动安装很有必要。手动安装比较复杂，且称之为 the hard way，如果实在没有耐心看，可直接跳过这部分，到后面去看 [the easy way](#easy).

### 跑起来先

启动服务端

    $ redis-server

默认在6379端口，可以指定在其他端口运行：

    $ redis-server --port 10101

### 为什么要自定义端口

为什么不永远用默认端口呢？因为一个redis实例要独占一个端口，如果一台机器上运行多个实例，就必须用到不同的端口。

再追问一句，什么情况下需要在一台机器上跑多个实例？想想看，要是在同一台机器上跑多个业务，它们就应该跑在不同的实例上，这样服务启停、配置文件以及数据等都互相隔离，灵活性高。另外redis是单线程的，无法利用多核优势，所以当遇到使用 redis 特别重的业务，划分到多个实例可以提高性能。

为了方便按需配置，每个实例最好有自己的配置文件，在配置文件中，你可以任意指定实例的端口号、数据目录、pid文件、日志文件等等。不过redis官网给出了命名规范，最好按照规范来。

### 自定义端口 step by step

下面就用一个例子把规范熟悉一下。假设要在这台机器上新建一个 redis 实例，运行在 6001 端口。那么根据命名规范，配置文件应该起名叫 6001.conf，并且放到 /etc/redis 目录下。

首先新建一个目录

    $ sudo mkdir /etc/redis

接下来是把配置文件放进去，我们不需要从零开始写配置文件，而是拿 redis-stable 目录下已有的 redis.conf 文件改改就可以。先拷贝一份默认的配置文件到 /etc/redis 目录下，同时命名为6001.conf：

    $ sudo cp redis.conf /etc/redis/6001.conf

打开配置文件，修改一些参数

    $ sudo vim /etc/redis/6001.conf

按照规范，修改这5项：

    daemonize  yes
    pidfile    /var/run/redis_6001.pid
    port       6001
    logfile    /var/log/redis_6001.log
    dir        /var/redis/6001

为什么端口号重要，你看上面除了 daemonize，其余四项均和端口号有关。

daemonize 设置成 yes，就是在后台运行，并且会创建 pidfile。注意如果你在 /var/run 目录下找不到 reis_6001.pid 文件，可能是因为没有用root身份运行。

dir 用来存放持久化文件的数据目录，同时也是实例的工作目录。这项配置最重要，一定要保证目录存在，我们用命令建好目录：

    $ sudo mkdir -p /var/redis/6001

pidfile 用来检查 redis 实例是否在运行，这个检查不是很严格，当 redis-server 以后台方式运行的时候创建 pid 文件，这个文本文件的内容就是它的进程ID。当实例正常退出时会删掉 pid 文件。但如果是非正常退出，比如杀掉进程，pid 文件也会残留。此时残留的 pid 文件会造成进程还在运行的假象，并阻止再次启动。遇到这种情况启动不了怎么办？删掉这个pid文件再启动就行了。


### 使用初始化脚本

上面我们搞定了配置文件，从指定配置文件启动的命令是

    $ redis-server <配置文件>

根据上面我们的实际情况，就是：

    $ redis-server /etc/redis/6001.conf

可是这样必须要进入 shell，通过命令来运行。怎样能让 redis 随系统启动运行呢？redis-stable/utils 目录里有个用来自动运行 redis-server 的初始化脚本，名为 redis_init_script，我们以它为蓝本，不要直接改这个文件，拷贝一份到 /etc/init.d/ 目录下，并重命名为 redis_6001

    $ sudo cp utils/redis_init_script /etc/init.d/redis_6001

这个初始化脚本的端口号是默认的 6379，不要忘了修改：

    $ sudo vim /etc/init.d/redis_6001


内容示例：

    REDISPORT=6001
    EXEC=/usr/local/bin/redis-server
    CLIEXEC=/usr/local/bin/redis-cli

    PIDFILE=/var/run/redis_${REDISPORT}.pid
    CONF="/etc/redis/${REDISPORT}.conf"


从初始化脚本中可以看到，PIDFILE 的路径和我们在配置文件里的是一致的。CONF 是配置文件的路径，与我们之前拷贝过去的 /etc/redis/6001.conf 吻合。其实只要保证这些路径能对的上，并非一定要按照官网的规范来，但遵循官网的规范可以最大程度降低我们配置时出错的可能。

有了初始化启动脚本 /etc/init.d/redis_6001，就有了一种新的方式来启动和停止 redis：

    $ sudo /etc/init.d/redis_6001 start
    $ sudo /etc/init.d/redis_6001 stop

一般在 /etc/init.d 目录下的脚本都是服务的初始化脚本，支持 start, stop, restart, reload 几个命令，但是 redis 的初始化脚本目前只支持 start 和 stop。如果修改了配置文件想要立即生效，只好先 stop 然后 start。（2015-10-23修订：目前已支持 status 和 restart 命令）

现在有了初始化脚本，但还不够，要把它加到系统启动时要运行的程序列表里，才能实现开机自启。

### redis 开机自启

开机自启是怎么实现的？Linux 启动时会有一个运行级别，Ubuntu 默认的运行级别是 2，所以系统就会到 /etc/rc2.d 这个目录里逐个运行里面的脚本。但是这里存放的不是真正的脚本文件，而是指向脚本的 link。下面这条命令的作用就是生成一些 link：

    $sudo update-rc.d redis_6001 defaults

    Adding system startup for /etc/init.d/redis_6001 ...
        /etc/rc0.d/K20redis_6001 -> ../init.d/redis_6001
        /etc/rc1.d/K20redis_6001 -> ../init.d/redis_6001
        /etc/rc6.d/K20redis_6001 -> ../init.d/redis_6001
        /etc/rc2.d/S20redis_6001 -> ../init.d/redis_6001
        /etc/rc3.d/S20redis_6001 -> ../init.d/redis_6001
        /etc/rc4.d/S20redis_6001 -> ../init.d/redis_6001
        /etc/rc5.d/S20redis_6001 -> ../init.d/redis_6001


上面这条命令在 /etc/rcN.d 目录下（N从0到6）创建了总共 7 个 link，它们都指向 /etc/init.d/redis_6001。

关于 update-rc.d 命令的详细说明，参考[此处](http://manpages.ubuntu.com/manpages/hardy/man8/update-rc.d.8.html)。

查看一下 /etc/rc*.d 目录下生成的 link：


    $ ls -l /etc/rc*.d | grep redis

    lrwxrwxrwx 1 root root  20 Mar 23 12:17 K20redis_6001 -> ../init.d/redis_6001
    lrwxrwxrwx 1 root root  20 Mar 23 12:17 K20redis_6001 -> ../init.d/redis_6001
    lrwxrwxrwx 1 root root  20 Mar 23 12:17 S20redis_6001 -> ../init.d/redis_6001
    lrwxrwxrwx 1 root root  20 Mar 23 12:17 S20redis_6001 -> ../init.d/redis_6001
    lrwxrwxrwx 1 root root  20 Mar 23 12:17 S20redis_6001 -> ../init.d/redis_6001
    lrwxrwxrwx 1 root root  20 Mar 23 12:17 S20redis_6001 -> ../init.d/redis_6001
    lrwxrwxrwx 1 root root  20 Mar 23 12:17 K20redis_6001 -> ../init.d/redis_6001


一共创建了 7 个 link，是为了保证无论在哪个运行级别下都能运行。

此时重新启动系统，就会自动运行redis-server了。当然也可以从开机自启列表中移除，命令是：

    $ sudo update-rc.d -f redis_6001 remove

### 关闭redis的正确方法

不要杀进程，因为可能会丢失数据。况且杀掉进程后，pidfile 会残留，此时初始化脚本会被残留的 pidfile 欺骗，以为 redis-server 还在运行着。

正确的关闭方法是：通过 redis-cli 连上后，执行 shutdown 命令：

    $ redis-cli -p 6001 shutdown

但是用命令的方式经常忘记指定端口号，就会去连默认的6379端口，搞错了实例。

推荐使用执行初始化脚本的方法来关掉实例，因为脚本名上自带了端口号，所以不会忘记而使用了默认端口号：

    $ sudo /etc/init.d/redis_6001 stop

打开初始化脚本，你会发现，它关闭实例的方式和你在命令行里输入的命令一模一样。

## <a name="easy"></a> The Easy Way

以上是 the hard way，怎样是不是走的很辛苦？redis 的安装包里提供了自动化安装脚本，用起来简单得多。

redis-stable 目录下有个 utils 目录，自动化安装脚本 install_server.sh 就在那。可执行文件准备好之后，运行这个脚本，根据提示只需要在开始给一个端口号（下面例子中给的端口号是 6000），如无特殊需要，后面就一路回车用默认的配置即可：

    $ cd utils
    $ sudo ./install_server.sh
    
    Welcome to the redis service installer
    This script will help you easily set up a running redis server

    Please select the redis port for this instance: [6379] 6000
    Please select the redis config file name [/etc/redis/6000.conf]
    Selected default - /etc/redis/6000.conf
    Please select the redis log file name [/var/log/redis_6000.log]
    Selected default - /var/log/redis_6000.log
    Please select the data directory for this instance [/var/lib/redis/6000]
    Selected default - /var/lib/redis/6000
    Please select the redis executable path [/usr/local/bin/redis-server]
    Selected config:
    Port           : 6000
    Config file    : /etc/redis/6000.conf
    Log file       : /var/log/redis_6000.log
    Data dir       : /var/lib/redis/6000
    Executable     : /usr/local/bin/redis-server
    Cli Executable : /usr/local/bin/redis-cli
    Is this ok? Then press ENTER to go on or Ctrl-C to abort.
    Copied /tmp/6000.conf => /etc/init.d/redis_6000
    Installing service...
    Adding system startup for /etc/init.d/redis_6000 ...
    /etc/rc0.d/K20redis_6000 -> ../init.d/redis_6000
    /etc/rc1.d/K20redis_6000 -> ../init.d/redis_6000
    /etc/rc6.d/K20redis_6000 -> ../init.d/redis_6000
    /etc/rc2.d/S20redis_6000 -> ../init.d/redis_6000
    /etc/rc3.d/S20redis_6000 -> ../init.d/redis_6000
    /etc/rc4.d/S20redis_6000 -> ../init.d/redis_6000
    /etc/rc5.d/S20redis_6000 -> ../init.d/redis_6000
    Success!
    Starting Redis server...
    Installation successful!

至此，两条路都走过了，一条艰难的一条容易的。以后再安装 redis，不管你们选哪条路，我反正肯定选 the easy way :)