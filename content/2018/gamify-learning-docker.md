---
title: 游戏化学习 Docker
date: 2018-04-07 07:00:00
layout: post
style: code
---

清明放假在家，打算尝试一种新的学习方式。

这种学习方式，我给起个名字，就叫「自导自演游戏化学习」。先就拿学习 Docker 举例。所以本文的重点不在 Docker 相关的内容，而在学习方式。

学习目标：掌握 Docker 的基本概念和基本操作


## Level 1
完成这个级别后，你将会得到下面这枚勋章。

<img class="center" src="/img/2018/gamify-learning-docker_level-1.png"/>

### Docker 是什么？
不重要。反正它是目前最流行的 Linux 容器解决方案，没有之一。

Docker 将应用程序与该程序的依赖，打包在一个文件里面。运行这个文件，就会生成一个虚拟容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。

### Docker 的用途

1. 提供一次性的环境。比如，本地测试他人的软件、持续集成的时候提供单元测试和构建的环境。

2. 提供弹性的云服务。因为 Docker 容器可以随开随关，很适合动态扩容和缩容。

3. 组建微服务架构。通过多个容器，一台机器可以跑多个服务，因此在本机就可以模拟出微服务架构。

### Docker 的安装

官方安装指南：
- [for Mac](https://docs.docker.com/docker-for-mac/install/)
- [for Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

Mac 版本的 Docker 带图形界面，在下拉菜单里有个叫 Kitematic 的功能几乎完全图形化了 Docker 的操作，带来不小的便利。

本文接下来的例子都基于 Ubuntu，安装好以后，运行 docker 的命令是：

	service docker start

好了，你现在已经初步认识了 Docker 并且运行起来了，恭喜得到第一个勋章！


## Level 2

在这个级别，我们要掌握几个最核心的概念，以及最实用的操作。完成后你将得到下面这枚勋章！

<img class="center" src="/img/2018/gamify-learning-docker_level-2.png"/>

### 镜像文件
Docker 把应用程序及其依赖，打包在一个二进制文件里，我们管它叫镜像文件，简称镜像。根据镜像生成容器实例，也就是最终要运行的程序。同一个镜像可以生成多个同时运行的容器实例。我觉得镜像和容器实例的关系类似操作系统中可执行文件和进程的关系。

本教程需要从仓库下载镜像文件，但是国内访问 Docker 的官方仓库很慢，还经常断线，所以要把仓库网址改成国内的镜像站。

打开`/etc/default/docker`文件（需要sudo权限），在文件的底部加上一行。

	DOCKER_OPTS="--registry-mirror=https://registry.docker-cn.com"

然后，用下面命令重启 Docker 服务：

	service docker restart

经我测试，国内镜像仓库的下载速度至少十倍于官方仓库。

### 运行第一个容器

既然 Docker 的最大用处是做微服务，那我们就以 nginx 作为例子，跑一个容器看看。

	docker container run nginx

这条命令会先检查本地有没有 nginx 的镜像，如果没有则先从仓库把镜像下载下来，然后由这个镜像启动一个容器。

执行命令后，嗖嗖的就下载完了，然后就……不动了。其实这时候 nginx 已经运行起来了，只是进入了命令行交互模式。如果是一般的程序，运行完了就退出到命令行了，但 nginx 是一个常驻的服务，所以没有退出，看起来就像卡在那不动似的。按`ctrl + C` 即可退出。退出后会留下一个容器文件，通过以下命令可以查看到：

	docker ps -a

加上`-a`参数会把已经停止的容器实例也列出来，第一列 Container ID 是一串十六进制编码的字符串，用它可以把已经退出的容器实例瞬间启动起来，命令是：

	docker start <Container ID>

其实容器文件在容器实例刚一运行的时候就被创建出来了，删除掉容器文件的命令是：

	docker container rm <Container ID>

注意，如果一个容器还在运行中，是无法删除的，必须先停下来：

	docker stop <Container ID>

或者加一个 `-f` 参数：

	docker container rm -f <Container ID>

能不能一上来就让 nginx 运行在后台呢？当然可以，只要加一个 -d 参数，命令是：

	docker container run -d nginx

如果想在容器实例退出后立刻删除容器文件，可以给 docker container run 命令加一个 `--rm` 参数：

	docker container run —rm -d nginx

此时我们用 `docker stop <Container ID>` 命令停掉刚刚启动的这个容器，然后执行：

	docker ps -a

看到容器文件已经不在了。

## 用起来
有了 nginx 镜像就有了一个现成的 Web Server，我们把它视为一个微服务，领略一下 Docker 的真正作用。

Docker 容器跑起来后，就创建了一个与外面的物理机隔绝的虚拟环境，加入容器内的 nginx 在 80 端口跑着一个网站，如何才能访问到呢？需要做端口映射，参数是 `-p <本机端口>:<容器端口>`，例如：

	docker container run -d -p 3000:80 nginx

以上命令是把本机的 3000 端口映射到容器内的 80 端口。因为容器内的 nginx 已经默认在 80 端口上跑了一个网站，所以只要访问本机的 3000 端口，就能访问到容器内的 80 端口。

### 进入容器修改文件

`docker container exec`命令用于进入一个正在运行的 docker 容器。如果`docker run`命令运行容器的时候，没有使用 `-it` 参数，就要用这个命令进入容器。一旦进入了容器，就可以在容器的 Shell 执行命令了。

进入容器之前，先要查到它的 container ID，运行命令：

	docker ps

在第一列找到 container ID 后，执行下面命令：

	docker container exec -it <container ID> /bin/bash

进入容器内了！现在我们改一改文件。
由于我们安装的 nginx 容器非常纯粹，里面甚至连 vim 都没有，所以要在容器内改动文件的话，先安装个 vim：

	apt-get update
	apt-get install vim -y

安装完以后，就可以打开文件进行编辑了，我们打开默认跑在 80 端口的首页 index.html 文件：

	vim /usr/share/nginx/html/index.html

在页面里做如下修改：
```
<!--<h1>Welcome to nginx!</h1>-->
<h1>Welcome to Docker!</h1>
```

然后在容器外面访问页面 `localhost:3000`，看到页面上的欢迎语 Welcome to Docker！

恭喜，你已经完成了 Level 2，快回到上面去领取徽章吧！顺便回顾一下这节的内容。

---

游戏化学习，英文叫 gamify，它的发音非常像 give me five，这正好契合了游戏化学习的精神，就是不断的给与激励，在激励中前行。后面我还会继续尝试这种方式，提升参与感，让学习过程变得有趣。在开始的阶段，是不是有趣，能不能坚持下来，比内容本身重要得多。本文的教学内容一多半摘自阮一峰的博客，我几乎没怎么费心，这大大降低了制作课程的成本。现在太忙了，只有成本足够低我才能坚持下去。



