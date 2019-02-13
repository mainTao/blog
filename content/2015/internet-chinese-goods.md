---
title:  互联网新国货
date: 2015-07-28 07:00:00
layout: post
style: code
tags:
---

几年前，Gmail 处理邮件，GitHub 管理代码，是有逼格的技术人员的标配，国内也不例外。

可就最近几年的工夫，国内互联网企业奋起直追，大有赶超之势。经过反复比较，我把好几个国外的服务替换成了国内的，大名鼎鼎如 GitHub、Gmail 赫然在列。

国内互联网服务的主要优势有两个，一是网速快，二是便宜。这两点简直太关键了，尤其第一点。装逼过了新鲜劲儿以后，影响我决策的依然是速度、价格这些刚需。

## QQ 邮箱

![](/img/2015/internet-chinese-goods_qqmail.png)

我最早切到国内服务的是邮箱，之前用 Gmail，虽然酷但是经常速度奇慢或干脆打不开……你懂的。后辗转到微软的 live 邮箱，照旧慢（hotmail, outlook 是它的另外两件马甲）。终于逼得我要找一个靠谱的国内邮箱了。觉得腾讯的邮箱最方便，原因有几个：
1. QQ 客户端会通知新邮件
2. 腾讯企业邮箱也可以通过 QQ 一键打开
3. 不用再整一个账号（谁都有 QQ 号）
4. 别人只要知道我 QQ 号就能发邮件给我（QQ号@qq.com）
5. 界面简洁，速度快

## coding.net

![](/img/2015/internet-chinese-goods_coding-net.png)

提起代码托管网站，GitHub 是绝对的第一，甚至有人戏称它是世界最大的男性交友网站。

但是在国内访问 GitHub 经常会遇到问题。遇到代码无法 pull 或者 push，有时多试几次就好了，可有时反复试也不行，如果事情紧急真能把人急死。

国内的代码托管最早尝试过 GitCafe，做的挺不错，托管私有项目收费比 GitHub 便宜很多，而且速度杠杠的。不过后来发现了 [Coding](https://coding.net)，就弃掉了 GitCafe。


来看看 Coding 有哪些优势：

1. 免费托管私有项目
2. Web IDE，只要有浏览器就能写代码和提交代码
3. 有运行环境，例子能直接跑起来，不需要自己找服务器部署

## taobao npm 镜像

![](/img/2015/internet-chinese-goods_taobao-npm.jpg)

搞 Node.js 的人自然无法回避 npm，现在就连搞前端的人也躲不过去了，因为一些著名的打包构建工具都在 npm 上。

npm 是好东西不假，但在国内就……（心中奔过一万只草泥马，什么好东西到了国内都变这熊样！）

阿里是一个伟大的公司，因为它把一些事变得方便快捷，例如购物，再例如写代码:) 

npm 不是慢吗？那就在国内整个[镜像](http://npm.taobao.org/)，十分钟一同步，所以不用担心版本旧。看来以后 npm 的用处沦落到和 IE 一样了，IE 是为了下载 Chrome，npm 是为了下载淘宝的 cnpm:
    
    $ npm install -g cnpm --registry=https://registry.npm.taobao.org

安装完成，以后用 npm 的地方就都用 cnpm 替代吧。

## Sea.js

![](/img/2015/internet-chinese-goods_seajs.png)

web 前端的包管理工具，那说起来都是泪，推陈出新的速度忒他妈快，RequireJS 才用了没一会儿，webpack 这样的大杀器都出来了。webpack 今天且按下不表，来说说和 RequireJS 很像的 [Sea.js](http://seajs.org/)，一个同样出自阿里的国货。

RequireJS 有个很不好的地方，就是 require 出现的顺序和真正加载的先后顺序不一样，这导致没办法预判某个时候模块是否已经加载了。更多细节[参考这里](http://www.zhihu.com/question/20342350)。

什么是清晰的代码逻辑？就是运行的结果正如代码看上去那样。让读代码的人相信他所看到的，不迟疑、不困惑。这一点上 Sea.js 确实干得比 RequireJS 漂亮。

## 总结

中国互联网发展的速度确实快，与以往我们印象中的 Made in China 不同，这次不再是以量取胜，以成本低取胜。在技术社区能看到越来越多中国的 ID，他们不再甘当配角，不再投机取巧，而是堂堂正正地与国外朋友同台竞技，以武会友，以德服人。生在这样一个时代，是幸运的。
