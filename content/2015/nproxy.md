---
title: NProxy
date: 2015-06-21 07:00:00
layout: post
style: code
tags: 
---

## Why NProxy

SPA（Single Page Application）时代，大部分编码工作转移到了前端工程师手里，不过还是免不了要调用服务端的 API。

通常情况下，这些 API 是后端工程师开发的，部署在服务器上。而前端工程师的代码是在自己的开发用机上编写，调试时要先把本地写好的代码部到服务器上，像这样：

![](/img/2015/nproxy_workflow.jpg)

为什么不在本机直接调试，而要把前端代码也部署到服务器上？一个原因就是跨域。不允许跨域是浏览器为了安全加的限制，却给开发带来了不便。NProxy 就是用来解决这一问题的利器。有了 NProxy，前端的开发流程就可以像这样：

![](/img/2015/nproxy_ideal-workflow.jpg)

原理很简单，就是把远程的地址映射成本地的地址。对你写的程序而言，它以为自己真的已经部署在服务器上，因为程序中所有的地址都是真实的服务器端地址（静态资源地址、动态接口地址）。而事实上，经过 NProxy 在中间偷梁换柱，一部分地址（通常是静态资源地址）被替换成本地地址，这一过程对浏览器是透明的，所以不会有跨域问题。

类似的工具有很多，为什么选择 NProxy？下面是 NProxy 的作者列出的与竞品的对照表，尽管有点王婆卖瓜的意思。其实还有很重要的一点作者没有提，就是 NProxy 是免费的，而且开源(MIT
license)。如果要在团队中使用，跨平台和免费是很重要的考量。

![](/img/2015/nproxy_compare.jpg)

## How to Use NProxy

NProxy 的安装步骤不复杂， 下面图上讲的很清楚。

![](/img/2015/nproxy_steps.jpg)

第五步设置代理在这里就略过了，网上很多资料。除此之外，唯一需要折腾的是第三步：准备一个配置文件。这个配置文件里写的是一条条映射规则。pattern 是一个正则表达式，用来匹配页面端请求的地址，responder 是要映射到的目标地址。

``` javascript
module.exports = [
  {
    pattern: /http:\/\/localhost:8080\/api\/(.*)/,
    responder:  'http://example.com/api/$1'
  }
];
```

注意上面例子中 responder 值里的 $1 指的是正则表达式匹配到的第一个组，也就是 http://localhost:8080/api/ 后面的全部内容。有了这条规则，我们就可以完全在本地调试，API
的地址也指向 localhost，但实际上本机并没有 API 部署，而是通过 NProxy 映射到真正的服务器上。

上面说的是网页的静态资源都在你的本机上，将服务端的真实 API 伪装成在本机上以解决跨域问题。还有一个需求场景是，网站已经上线，你想修改一两个 js 或 css 文件看看效果，但又不敢妄动线上的代码。遇到这种情况，可以用本机的文件来伪装成是线上的。

你可以替换某一个文件：
![](/img/2015/nproxy_single-file.jpg)
<br>

也可以替换一个目录下所有的文件：
![](/img/2015/nproxy_dir-mapping.jpg)
<br>

如果你的线上代码是合并过的，还可以用本地的多个文件来替换。它还有另外一个用处，线上压缩过的代码出了脚本错误不好调试，用本地未压缩过的代码替换后就方便调试了。
![](/img/2015/nproxy_merge.jpg)
<br>

最后分享一个最简单也最常用的配置：
``` javascript
  {
    pattern: /10.31.16.248/, // 服务器地址
    responder:  '/Users/chao/project' // 本地路径
  }
```
只要在本地 project 能找到的就用本地的，找不到的则用服务器上的，非常智能。比如一个 API 在本地没有，则会自动向服务器发起请求。

参考资料：

- [上面这些漂亮的图在这里](https://speakerdeck.com/goddyzhao/nproxy-a-sharp-weapon-for-ui-developers) 国内访问不了？[希望这个对你有用](http://www
.maintao
.com/2015/use-shadowsocks/)
- [NProxy on GitHub](https://github.com/goddyZhao/nproxy)



