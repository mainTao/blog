---
title: Powered By Hugo
date: 2019-02-14
layout: post
style: code
tags: 
---

# 为什么迁移到 Hugo

2019，我的博客看起来还是老样子，但底层完全换了，由 hexo 换成了 hugo。

自 2014 年建博客以来，已经过去五个年头。这期间 Node.js 经历了起起落落落落。而与此同时，Go 语言渐渐受到业界的追捧，一张图说明一切：

![](/img/2019/powered-by-hugo_node-vs-go.png)

论生成页面的速度，hexo 已经很快了，可谁能想到 hugo 的速度还要再快几十倍！没有比较就没有伤害，我博客的这两百多篇文章用 hexo 生成需要 5 秒，而用 hugo 只要 0.2 秒！

提一个 Hugo 的缺点，就是文档对新手不够友好。好在 YouTube 上有个小哥 Mike Dane，做了[一系列视频教程](https://www.youtube.com/playlist?list=PLLAZ4kZ9dFpOnyRlyS-liKL5ReHDcj4G3)，一看就懂，可见 Hugo 并没有那么复杂，只是官方文档不友好。

除了文档不友好，还有一个影响 Hugo 流行的障碍，就是对前端开发者而言不如基于 Node.js 的 hexo 容易上手。一个建站工具，最大的用户群和主题贡献者，都是前端开发者。前端见过太多轻巧优雅的模板，很难瞧得上 Hugo 那套模板。

反过来看，Hugo 先天条件如此不利却依然能崛起，必然蕴藏着一股更强大的生命力。

# 安装

详细的安装步骤可参考官网 [Install Hugo with Brew](https://gohugo.io/getting-started/installing/#install-hugo-with-brew).

以下是懒人精简版：

Mac 上初次安装:

```
brew install hugo
```

以后升级版本：
```
brew upgrade hugo
```


# 网站目录结构

```
hugo new site MySite
```
执行完，会生成一个 MySite 文件夹，结构如下：

```
MySite/
├── archetypes/
│   └── default.md
├── config.toml
├── content/
├── data/
├── layouts/
├── static/
└── themes/
```
本文只会用到 archetypes 目录和 config.toml 配置文件，还会涉及到 content 和 themes 目录。其他的先不用管。

# 添加主题

下篇我再讲如何构建自己的主题，这次我们先用现成的。

```shell
cd MySite
git clone https://github.com/budparr/gohugo-theme-ananke.git themes/ananke
```
先进入 MySite 项目目录，然后把主题下载到 themes 目录里。

虽然 themes 目录里只有一个主题，但 hugo 仍然不会自动使用它，因此还需要手动改配置文件来指定主题。打开 config.toml 文件，添加下面这行：

```toml
theme = "ananke"
```

# Front Matter

```shell
hugo new my-first-post.md
```
执行以上命令，就会在 content 目录下新建一个 my-first-post.md 的文件，里面除了有一个头（英文叫 front matter），并没有其他内容。

那问题来了，这个头是怎么生成出来的呢？它的生成模板，正是 archetypes 目录下的 default.md 文件。打开它看看就明白为什么生成出来的头长这样了。

默认 default.md 的头是 toml 格式的，也支持 yaml 和 json。而因为我之前的博客是 yaml 格式头，所以就继续用 yaml 了，如下：

```yaml
---
title: {{ replace .TranslationBaseName "-" " " | title }}
date: {{ dateFormat "2006-01-02" .Date }}
---
```

title 和 date 是一篇文章必不可少的，先解释 title 这行：

1. `.TranslationBaseName` 其实是 `.File.TranslationBaseName` 的简写，具体定义见 [File Variables](https://gohugo.io/variables/files/).
2. [replace](https://gohugo.io/functions/replace/) 是一个函数，此处用来把文件名中的横线替换成空格。
3. 后面一个竖线（[管道符](https://gohugo.io/hugo-pipes/)）跟随着 [title 函数](https://gohugo.io/functions/title/)，目的是把这个字符串再格式化一下，比如首字母大写，让它有个标题样。

理解这一行代码是不是有点吃力。接下来的 date 也不好理解，且看下文解读。

# 有意思的时间格式

如果细心会发现我上面用了一个写死的时间戳 2006-01-02，其实完整的是下面这样：

```
Mon Jan 2 15:04:05 MST 2006
```
其中 MST 是 Mountain Standard Time 的缩写，即[北美山区标准时间](https://www.timeanddate.com/time/zones/mst)。为什么选了这么个时间点呢？因为它是 01 月 02 日下午 03 点 04 分 05 秒，06年……看出规律了吧。这样即便你忘了具体时间，也能依照数字递增的规律把它补全。

有了这个特殊日期以后，就可以丢掉 YYYY-MM-dd 这样晦涩的格式，而使用 2006-01-02 这样更直观的形式。

解释下面这行：

```yaml
date: {{ dateFormat "2006-01-02" .Date }}
```
1. [dateFormat](https://gohugo.io/functions/dateformat/)是个函数，用来格式化出想要的日期形式
2. `.Date` 是页面上自带的变量，具体定义见 [Page Variables](https://gohugo.io/variables/page/#page-variables)
3. `.Date` 直接显示出来是 2019-02-11T17:57:28+08:00，作为博客中的日期，想要的是`2006-01-02`这样简单的日期格式

如果想要不一样的日期格式，可参考这里的实例：[Hugo Date and Time Templating Reference](https://gohugo.io/functions/format/#hugo-date-and-time-templating-reference)。

Hugo 对时间有着很详细的定义，有发布时间 `.PublishDate`、最后修改时间 `.Lastmod` 等等。但我觉得没必要如此严格地区分，一篇文章一个时间戳足够了，多了反倒乱。所以我的做法是只用 `.Date`，并将它视为文章的发布日期。

# 大写的 F

执行命令 build 整个网站，默认当前时间之后的文章不会发布出来。这么做看似聪明，实则脑残。把明天要发布的内容先 build 出来到了明天再上线，多么常见的需求，竟然不行。

还好有办法可以解决：大写的 `-F` 选项，完整形式 `--buildFuture` 顾名思义就是 build 未来要发布的页面。

想在本地起服务看所有文章（包括发布日期晚于当下的）：

``` bash
hugo server -F
```

生成所有文章（包括发布日期晚于当下的）：
``` bash
hugo -F
```

# 草稿先不发布

设置成草稿，只要在 frontMatter 里加上一行：

```yaml
draft: true
```
默认草稿是隐藏的。如果想预览草稿的样子，可能你都猜到了：大写的 `-D`，表示 `--buildDraft`。

以上内容，用 hugo 建博客最常用的操作就介绍完了。