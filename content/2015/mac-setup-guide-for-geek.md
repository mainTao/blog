---
title:  Mac setup guide for geek
date: 2015-08-21 07:00:00
layout: post
style: code
tags:
---

写[上一篇](http://www.maintao.com/2015/mac-setup-guide-for-common-user/)文章的时候，我没想好标题该怎么起，到最后用了 Mac setup guide 这个有些歧义的题目。其实用国人常见的一个词更为恰当——装机必备！Windows 上的 360 以及 Android 上的各种应用商店已经让「装机必备」这个词深入人心了。

今天这篇文章说是写给 geek 的装机必备，可能有些牵强，因为 geek 覆盖的面太广。但如果你是一个追求酷、追求效率的键盘侠，本文应该会适合你。

## homebrew

当你在 Mac 上安装一些命令行工具类的包，例如 wget、git、zsh 的时候，难找到合适的渠道。[homebrew](http://brew.sh/index_zh-cn.html) 是一个著名的包管理工具，在 Mac 上是不二之选。

即使如此著名的包管理工具，OS X 系统并没有自带，而是要用命令行安装：

    $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

安装完成后，就可以用它来安装其他的包了。举几个例子：

    $ brew install wget     # 安装 wget
    $ brew uninstall wget   # 卸载 wget
    $ brew upgrade wget     # 升级 wget
    $ brew home wget        # 打开 wget 官网
    $ brew list             # 列出本机上用 homebrew 安装的包

## homebrew cask

homebrew 用来安装命令行工具，而众多的非命令行软件一般是通过 AppStore 来安装。但由于 Mac 应用商店的种种问题，很多开发者放弃了在官方商店发布软件，另有一些软件则因为苹果从中作梗而无法发布，例如 Chrome。

安装的三方软件一多，每次装机都要挨个去官网下载一遍，也挺麻烦的。于是出现了 [homebrew cask](https://github.com/caskroom/homebrew-cask/)。

有了 cask，我们可以通过命令行的方式批量安装 GUI 软件，不光是提高了效率，而且很酷有没有！

首先要安装 homebrew cask（当然必须先装好 homebrew）: 

    $ brew install caskroom/cask/brew-cask

不得不说，cask 比单纯的 homebrew 还要有用，因为一般电脑上安装 GUI 软件的数量要多过命令行的，更新和卸载也更频繁。
cask 主要的用法，运行 brew cask help 命令就说得比较清楚了。下面看一个例子， 看看如何搜索 Alfred 并安装。

    $ brew cask search alfred
    ==> Exact match
    alfred
    
    $ brew cask install alfred
    ==> Downloading https://cachefly.alfredapp.com/Alfred_2.7.1_387.zip
    ######################################################################## 100.0%
    ==> Symlinking App 'Alfred 2.app' to '/Users/dc/Applications/Alfred 2.app'
    ==> Symlinking App 'Alfred Preferences.app' to '/Users/dc/Applications/Alfred Preferences.app'
    🍺  alfred staged at '/opt/homebrew-cask/Caskroom/alfred/2.7.1_387' (285 files, 7.9M)

有了 homebrew 和 homebrew cask，我再也不必在介绍一个软件的时候给出官网链接了，想看 shortcat 的官网？

    $ brew cask home shortcat
    
## shortcat

shortcat 是键盘侠耍酷神器，其名字显然是改造自 shortcut，简单说就是让你不用鼠标指针，直接操作键盘来点击按钮。

要注意，它只能点击原生应用的按钮，而不能是网页上的按钮（虽然也有办法兼容 Chrome，但不如 [cVim](http://localhost:4000/2015/cvim/) 好用）。现在越来越多的桌面应用采用了混合式的方案，即原生的框架内嵌网页，原生部分做壳，网页做内容的主要部分。所以对混合型的应用，shortcat 是基本帮不上忙的。

而且对于中文的界面，shortcat 对效率的提升有限，因为是要敲入按钮上部分字来进行选择的。举个例子，现在只有两个按钮，一个 ok，一个 cancel，调出 shortcat 然后输入字母 c, 就会匹配到 cancel，按下回车来触发对 cancel 的点击。

如果是中文系统呢？要先切换输入法，然后输入取消的「取」才能匹配到，比输入一个字母 c 麻烦了不少，甚至不如指针移上去点击更快。

那为什么还要用 shortcat 呢？因为酷！快不快不重要，关键要逼格高，这就是 geek 的范儿，not always for productivity. 我觉得可能我又不小心得罪了一群人。不敢再多说了，shortcat 的用法请看[这里](http://support.shortcatapp.com/kb/general/getting-started)。

## Alfred

Alfred 绝对是神器，每一个 geek 都需要，但是它有太多的功能，讲好几篇都讲不完，先刨个坑以后再填，因为少了 Alfred 实在对不住题目上的 for geek.

如果迫不及待想了解一下，你可以用上文说的 homebrew cask install 命令来下载安装，以及用 home 命令打开官网查看详情。

    $ brew cask install alfred
    $ brew cask home alfred

一个真正的 geek 不光是读快速引导手册，更乐于自己探索，一点一滴改进。

## 睡眠时间记录

上周我依然没养成早睡习惯，不过比起之前来，已经有了进步。本周仅有两天记录了睡眠时间：

8.17 睡眠时间 22:35
8.18 睡眠时间 23:48