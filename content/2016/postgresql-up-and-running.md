---
title: PostgreSQL up and running
date: 2016-07-21 07:00:00
layout: post
style: code
tags:
---

![](/img/2016/postgresql-up-and-running.png)

[PostgreSQL](https://www.postgresql.org/) 简称 pg。本人懒，以下全部用简称。

但我还是要多打一遍全称，为什么呢？因为不管学什么，装逼是第一刚需，哪怕只学一点皮毛，发音不能有半点马虎，来，先学一学正确发音：

PostgreSQL 念 post:gres:QL，拆成三部分来看：

1. post 发音同英语单词 post
2. gres 的 e 发音同 best 中 e 的发音
3. QL 直接念字母，que-el

关系型数据库，国内创业公司一般都选 MySQL，用 pg 的并不多。但我若干次接触 MySQL 都不是很爽，从网上看到说 pg 很不错，于是想在个人项目中先尝试一下。

- MySQL 被称作 most popular open source database
- pg 则被称为是 most advanced open source database，是不是最先进最强大先不说，至少最容易念错这锅它是背定了

关于 pg 和 MySQL 的优劣对比，随便谷歌一下 "postgresql vs mysql", 有很多详细的文章，这里就不多讲了。

### pg 的几个基本概念

- 实例(instance)：一台机器上可以跑多个实例，每个实例要占用单独的端口，默认只跑一个实例，默认端口是5432
- 数据库(database)：一个实例可以包含多个数据库
- 模式(schema)：一个数据库可以包含多个模式，模式之间的命名不会冲突，默认模式是public
- 对象(object)：模式里包含的所有东西都是对象，包括表、视图、索引、函数等等

## 在 Linux 上安装

这里我们以 Ubuntu 16.04 LTS 为例，如果你的操作系统不一样，可以去官网上找[不同平台的安装指南](https://www.postgresql.org/download/)。


    $ vim /etc/apt/sources.list.d/pgdg.list
    
添加这样一行：

    deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main

添加 key 然后更新 apt 的包列表：

    $ wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
      sudo apt-key add -
    $ sudo apt-get update

安装 pg，注意版本号可以自己指定，目前最新稳定版是9.5：
    
    $ apt-get install postgresql-9.5
    
安装完之后，Linux 系统中多了一个用户 postgres。同时 pg 数据库也会创建一个数据库用户，用户名也叫 postgres。还会创建一个数据库，数据库名还叫 postgres。

我们切换到 postgres 用户，然后直接连一下数据库看看：

    $ su - postgres
    $ psql

系统提示符变成了 `postgres=#`，表示已经成功登录到了名为 postgres 的数据库。

pg 的命令行客户端 psql 有个规则，就是当登录命令没指定数据库用户的时候，会以当前系统用户同名的数据库用户来登录，此时视为已经具备了该数据库用户的身份，因此登录时无需输入密码。这叫做 IDENT/PEER authentication。

另外还有个规则，如果登录时不指定数据库，会尝试登录与用户名同名的数据库。

知道这两条规则，就不难理解为什么刚刚不指定用户名密码和数据库就成功登上了。

自动创建的数据库用户 postgres 是超级用户，这个用户权限一旦被攻破后果不堪设想。因此，自动创建的同名系统用户 postgres 的权限安全也就同样重要，所以该用户默认是不能以用户名密码登录操作系统的，此乃故意为之。具体原因[这个帖子](http://serverfault.com/questions/110154/whats-the-default-superuser-username-password-for-postgres-after-a-new-install)有解释。

一般超级用户 postgres 只用来做管理，其他所有事情最好创建专门的数据库用户去做。注意 psql 里执行每条语句都要以分号结束。

创建用户（注意密码用单引号括起来）：

    postgres=# create user <user> with password '<password>';

创建好用户后，创建一个属于这个用户的数据库：

    postgres=# create database <database> owner <user>;
    
创建完数据库用户，再创建一个同名的系统用户：

    $ adduser <user>
    
切换成这个系统用户，就可以登录数据库： 
    
    $ su - <user>
    $ psql -d <database>
    
    
### 远程连接配置

默认只允许从本机登录，如果要远程连接数据库，需要改两个配置文件。

#### 1. 修改配置文件 postgresql.conf

    $ vim /etc/postgresql/9.5/main/postgresql.conf
    
把监听地址由默认的 localhost 改成 *

    listen_addresses = '*'

#### 2. 修改配置文件 pg_hba.conf

hba 这几个字母的意思是 host based authorization，就是对主机进行细粒度的访问控制。

pg_hba.conf 文件本身的注释里就解释了一通，官网有[更加详细的文档](https://www.postgresql.org/docs/9.5/static/auth-pg-hba-conf.html)。

打开文件：

    $ vim /etc/postgresql/9.5/main/pg_hba.conf
    
在文件中添加一行，把允许哪个用户访问哪个数据库写进去，如果怕麻烦不想挨个做限制，也可以写成 all。

允许某个用户从任何远程主机连接某个数据库：

```    
host    <database>   <user>     all    md5
```    

允许所有用户从任何远程主机连接所有数据库：

```    
host    all         all         all    md5
```    
    
改完这两个配置文件，需要重启服务才能生效：

    $ service postgresql restart
    
注意配置文件中不要有语法错误，否则服务不声不响地起不来，也不报错。我有幸踩了这个坑，因为在 pg_hba.conf 添加的那行结尾多了个分号，浪费了不少时间。

    
## 在 Mac 上安装

#### 服务端

在开发机上安装一个数据库，还是很有必要的。本地开发速度快，不依赖网络，而且可以随便折腾。

服务端推荐 [postgres](http://postgresapp.com/)。这是一个很独立的本地程序，打开就启动数据库服务，关上就没了。简洁漂亮，召之即来挥之即去，本地开发完全够用。

#### 客户端

命令行客户端，[postgres](http://postgresapp.com/) 自带的 psql 就很好，在菜单栏里很容易找到。

图形客户端，比较推荐付费软件 [postico](https://itunes.apple.com/cn/app/postico/id1031280567)。它还有个免费的前身 [pg commander](https://itunes.apple.com/cn/app/pg-commander/id669475285)。市面上没有特别好用的客户端，postico 是矬子里拔将军的无奈之选，不过作者更新还算勤奋，未来可期。


## 最有用的总结

要说我最喜欢 pg 什么，当然是它的 logo！大象有特别好的长期记忆，数据库就该给人安全感，哪怕仅仅是表面上的。

![](/img/2016/postgresql-up-and-running_mac-app.png)
