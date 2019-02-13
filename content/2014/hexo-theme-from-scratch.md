---
title: 从零开始定制hexo主题
date: 2014-05-07 23:40:02
layout: post
style: code
tags:
---

![](/img/2014/hexo-theme-from-scratch_tower-of-babel.jpg)

作为一个程序员，你是否曾遭遇过下面的境况：

你从别人那里拿到一大坨烂面条样代码，想要搞清里面的逻辑，但又千头万绪不知从何处下手。

尽管还没完全弄清楚这一大坨代码到底要干什么，你还是不得不硬着头皮改动其中某一部分，碰碰运气。

有时候，改动达到了预期的效果，你兴奋地几乎要跳起来。但更多时候是挫折，毫无理由的挫折，唯一的解释就是原作者代码写的太烂，唯一能绕过这个错误的方法是，换一台电脑，或者，再攒攒人品。

这样踉踉跄跄一路改下来，你渐渐把原来的代码改得不光自己看不懂，连原作者也看不懂了。你抱住头在心里说，这个世界上已没有人能救你。

[《程序员的思维修炼》](http://www.duokan.com/book/1917)里提到一种思想：

> 真正想要了解一只青蛙，传统的解剖不是办法，更好的方式是构造一只青蛙。（Don't Dissect the Frog, Build It）

在[《hexo入门指南》](http://www.maintao.com/hexo-beginner's-guide/)里我们知道了怎样用hexo建一个博客。至于如何定制自己的风格，则是一个庞大得多的话题。本文将引领你从零开始搭建一个完全属于自己的博客主题。

##了解主题(theme)

主题包含了模板(layout)，样式表，js脚本，以及主题相关的图片等资源。主题能完全主宰博客长成什么样子，以及具有哪些功能。

安装好hexo后，在themes目录下会有一个默认的主题landscape。里面的东西太多，若要逐个搞清楚，就又走上了解剖青蛙的老路。

我们从零开始打造一个主题，首先在themes目录下新建一个和landscape同级的目录，随便起个名字，例如maybe就是一个不错的主题。

建好的maybe目录里空空如也，接下来我们要添加一些必要的东西进去。

## 模板(layout)

主题中唯一不可或缺的元素，就是layout。layout里唯一不能少的是index.ejs，它用来生成首页。

博客的首页一般都是文章列表，点进去每个都是一篇文章。所以还需要生成文章列表的模板，以及点进去文章详情的模板。

参考下图，在maybe里建一个layout目录：

![](/img/2014/hexo-theme-from-scratch_layout-init-directory.png)

在探究模板之前，先别忘了到_config.yml文件里把原来的landscape主题换成maybe，如上图所示。

- post.ejs：每一篇单独文章的模板。
- post_entry.ejs：主页上文章列表中每一项的模板。
- index.ejs：是唯一必不可少的，是网站主页的模板。如果少了index.ejs会报错。

post.ejs
```html
<head>
    <title><%- page.title %></title>
</head>
<body>
<%- page.title %>
<hr>
<%- page.content %>
</body>
```

post_entry.ejs
```html
<div>
    <span><%- post.date.format("YYYY-MM-DD") %></span>
    <a href="<%- config.root %><%- post.path %>"><%- post.title %></a>
</div>
```

index.ejs
```html
<head>
    <title>index.html</title>
</head>
<body>
<% site.posts.sort("date", "desc").each(function(post){ %>
<%- partial("_partial/post_entry", {post: post}) %>
<% }) %>
</body>
```
ejs是一种用来生成html的模板语言，目前你只需要知道两点：

1. <%- %>里包含要写到页面上的内容
2. <% %>里包含的是不需要输出的js代码

拿index.ejs为例，第5~7行是一个循环，用来将所有文章一个个列出来。

其中第5、7两行完全是逻辑，不写页面，用<% %>包裹。

第6行是要写到页面上的单篇文章入口链接，因此用<%- %>包裹。

所谓模板，只是框架，里面的具体内容要靠数据来填充。以上代码中拿来填充的数据，例如site、page，是hexo的[全局变量](http://hexo.io/docs/variables.html#Global_Variables)。

第6行的[partial](http://hexo.io/docs/helpers.html#partial)，是一个[工具函数](http://hexo.io/docs/helpers.html)，它的用途是，拿数据{post: post}填充模板_partial/post_entry来绘制一段html，这段html的格式定义自_partial目录下的post_entry.ejs，数据来源于第5行传入的参数post，它作为{post: post}的value，进入到post_entry.ejs的上下文，因此才可以在post_entry.ejs里直接使用post变量。

## 用Markdown写两篇文章

有了模板，就差写两篇文章了。随便整两篇测试用的，放在与themes同级的source下的_posts目录里：

1st-post.md

```markdown
title: 1st post title
date: 2014-05-01 10:15:02
tags:
---

1st post is written in [markdown](http://markdown.tw/).
```

2nd-post.md

```markdown
title: 2nd post title
date: 2014-05-02 10:15:02
tags:
---

2nd post is written in [markdown](http://markdown.tw/).
```

既有了模板又有了文章，运行hexo server，带有maybe主题的网站就跑起来了。下面是截屏：

![](/img/2014/hexo-theme-from-scratch_run-index.png)

![](/img/2014/hexo-theme-from-scratch_run-post.png)

## 添加自定义样式和脚本

到目前为止，我们还没有添加任何样式或脚本，实在够不上是个合格的主题。

不过对于熟悉web开发的人来说，加一个样式和脚本实在太容易了。在maybe目录下新建一个source目录，仿照下图所示添所需的文件。

![](/img/2014/hexo-theme-from-scratch_source-directory.png)

index.ejs
```html
<head>
    <title>index.html</title>
    <link rel="stylesheet" href="/css/index.css"/>
</head>
<body>
<% site.posts.sort("date", "desc").each(function(post){ %>
<%- partial("_partial/post_entry", {post: post}) %>
<% }) %>
<script src="/js/script.js"></script>
</body>
```

index.css
```css
body{
  background: wheat;
}
```

script.js
```js
alert('script running');
```

我们在主页模板index.ejs中添加了一个外部样式css/index.css，用于改变背景色。添加的外部脚本js/script.js，用于简单弹出一个alert。

下面是运行效果：

![](/img/2014/hexo-theme-from-scratch_run-js-css.png)

至此，一个主题中最常见的几个部分（模板，css样式，js脚本）全都具备了。你有权掌控页面上的每一个像素，与那些几套皮肤换来换去的大众博客相比，感觉是不是爽多了。
