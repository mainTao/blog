---
title: Let's Encrypt
date: 2016-06-14 07:00:00
layout: post
style: code
---

现如今 https 几乎成了网站标配，但从 http 切换到 https 着实有不少工作要做。这些工作很琐碎，且处理起来必须小心翼翼，这也是很多网站迟迟没有用上 https 的原因。

公司的 app 里内嵌的网页遇到了运营商劫持，被插入了广告，逼的没有办法只好上 https 从技术上杜绝运营商劫持。

上 https 有很多坑要填，第一步就是搞定证书。以前证书要花钱买，一般是按年付费，到期后再续，而且价格不便宜，这把很多小网站拒之门外。幸好现在有了 [Let's Encrypt](https://letsencrypt.org/)，提供免费且能自动续期的证书。

往下看之前，最好先扫一眼这篇 [https 科普扫盲贴](https://segmentfault.com/a/1190000004523659)

## Let's Encrypt 工作原理

<img src="/img/2016/lets-encrypt_logo.svg" class="center"></img>

Let's Encrypt 基于 ACME 协议，ACME 缩写展开是 Automatic Certificate Management Environment，就是把证书的申请、续期、收回都自动化。

我们自己的服务器叫做 agent，授权证书的服务器叫做 CA（本文特指 Let's Encrypt CA）。首先由 agent 向 CA 证明域名是属于它的。怎么证明呢？就是通过域名能访问到这台服务器，并且这台服务器拥有被 CA 认可的秘钥。具体流程在官网有[详细介绍](https://letsencrypt.org/how-it-works/)。

认证完成后，就可以随时进行证书的发布、续期、回收（即取消发布）。

Let's Encrypt 的证书有效时间是 90 天，所以要在过期前 renew 证书已确保不会失效。

## Let's Encrypt 部署实战

官网上的[教程](https://letsencrypt.org/getting-started/)讲的很详细，若遇到阻碍官网是最好的参考。不过官网是英文的，篇幅有些长。我来一个中文精简版的教程：

letsencrypt 现在有了一个新名字：certbot。打开 [certbot](https://certbot.eff.org/) 网站，选择你使用的 OS 和 web server，就会打开相应的安装向导页面。我选择的是 Ubuntu 16.04 + Nginx，下面将以此为例进行演示，先确保服务器的系统是 Ubuntu 16.04，并已经安装好了 Nginx。

### 安装客户端

首先安装 Let's Encrypt 的客户端：

    $ sudo apt-get install letsencrypt 

安装完成后即可执行 letsencrypt 命令。letsencrypt 支持交互式的用户界面，很拉风，但我用过感觉图形界面反倒更折腾，不如在命令行里指定参数来得直接明了。

certbot 支持插件，在[官方支持的插件](https://certbot.eff.org/docs/using.html#plugins)中，有些只能用来获取证书，有些还能用来安装证书。其中尚未成熟的 Nginx 插件就集成了授权和安装两项功能，但是……目前该插件还处于试验阶段，并没有包含在安装包内。所以下面我们老老实实地用 webroot 插件来走一遍流程感受一下。

### 申请证书命令

使用 webroot 插件获取证书的命令格式如下：

    $ letsencrypt certonly --webroot \
        --webroot-path {网站A根路径} -d {域名A1} -d {域名A2} \
        --webroot-path {网站B根路径} -d {域名B1} -d {域名B2} 

一条命令中可指定多个网站根路径，可以有多个域名同时指向一个网站，所以一个 webroot-path 后面可以跟多个域名。

letsencrypt 命令支持交互式界面，如果在命令行中的参数有缺失，图形界面就会蹦出来让你补上必要的参数。这里有所有的[命令行参数](https://certbot.eff.org/docs/using.html#command-line-options)。

举一个实例，我已经在一台机器上搭建好了两个静态网站，分别是：

- 域名 disconn.org 和 www.disconn.org 指向的网站，根路径是 /var/www/disconn
- 域名 fnmain.com 和 www.fnmain.com 指向的网站，根路径是 /var/www/fnmain

现在我要给以上的域名申请证书，命令是：

    $ letsencrypt certonly --webroot \
        --webroot-path /var/www/disconn -d disconn.org -d www.disconn.org \
        --webroot-path /var/www/fnmain -d fnmain.com -d www.fnmain.com \
        --email dc10101@qq.com \
        --agree-tos \
        --expand

--email 替换成你的邮箱地址，若丢失了证书可用这个邮箱来讨回。
--agree-tos 表示同意 ACME 用户协议，不加这个参数会弹出界面来让你选择同意不同意。
--expand 若本机之前已经安装过的证书域名和本次申请证书的域名有交集，加上这个参数可免去一次讨厌的人机交互。

letsencrypt 不支持通配子域名的写法，例如 *.disconn.org，所以必须把子域名一个一个写出来。

若申请证书的命令执行成功，会输出一段文字，类似：

    - Congratulations! Your certificate and chain have been saved at
    /etc/letsencrypt/live/disconn.org/fullchain.pem. Your cert will
    expire on 2016-09-11. To obtain a new version of the certificate in
    the future, simply run Let's Encrypt again.

其中指明了证书保存的路径，我们看一下路径里有哪些文件：

    $ ls -l /etc/letsencrypt/live/disconn.org
    
会发现四个以 pem 结尾的文件，分别是：

- cert.pem 域名证书文件
- chain.pem 证书链文件
- fullchain.pem 域名证书文件 + 证书链文件
- privkey.pem 私钥文件

这些文件我们在接下来 Nginx 配置会用到。

### 自动更新证书

更新证书的命令非常简单：

    $ letsencrypt renew

若证书离过期时间还远（多于30天），则不会更新证书。所以不要让间隔超过30天，用 crontab 创建一个计划任务：

    $ crontab -e
    
添加一行：

    0 4 1,31 * * letsencrypt renew >> /var/log/letsencrypt-renew.log; service nginx reload
    
每月1日和31日（如果有31日）的凌晨4:00尝试更新一次证书，并重新加载 Nginx 的配置文件。Nginx 配置文件没有改动，为什么要重新加载呢？因为 Nginx 运行起来会把配置文件中指定的证书载入内存，若不 reload 则还会用内存中旧的证书。

更多更新证书的细节，[参考这里](https://certbot.eff.org/docs/using.html#renewal)。

## Nginx https 配置

创建一个配置文件，路径是 /etc/nginx/conf.d/disconn.conf，内容如下：

```
    server {
        listen       80;
        listen       443 ssl;
        server_name  disconn.org www.disconn.org;
    
        if ($ssl_protocol = "") {
           rewrite ^   https://$server_name$request_uri? permanent;
        }
    
        ssl_certificate      /etc/letsencrypt/live/disconn.org/cert.pem;
        ssl_certificate_key  /etc/letsencrypt/live/disconn.org/privkey.pem;
    
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout  5m;
    
        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers   on;
    
        location / {
            root   /var/www/disconn;
            index  index.html index.htm;
        }
    }
```

在上面的配置文件同时监听 80 和 443 端口，这样 http 和 https 就能一并处理。也可以把 80 和 443 端口放到两个不同的配置文件里。

指明 server_name 是告诉 Nginx，当域名是 disconn.org 或 www.disconn.org 的时候交由本配置文件处理。

ssl_certificate 指定域名证书文件路径。ssl_certificate_key 指定私钥文件路径。

若需要将所有 http 请求都自动重定向为 https，就加上第6到第8行的逻辑。

修改完配置文件，别忘了 service nginx reload

打开浏览器，看看地址栏上是不是有了绿色的小锁 :-）
