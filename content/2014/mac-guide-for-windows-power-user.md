---
title: 写给Windows高级用户的Mac指南
date: 2014-11-14 07:00:00
layout: post
style: code
tags:
---

#在进入正题之前

2009年，我还是一个血统纯正的Windows用户，纯正到浏览器只用IE。要知道，浏览器是微软做得最烂的产品，在当时就已经被FireFox甩开几条街。

我身为一个IT青年，无知无觉地用了IE那么多年，不以为耻反以为荣，看到有人用别的浏览器觉得多余，心说不就看看网页嘛，瞎折腾什么，IE完全够用，兼容性还好。唉，这就是当年的我，真是不堪回首。

后来因为女朋友用FireFox的缘故，我才给自己的机器也装上一个火狐浏览器，之后便一发不可收拾，安了无数插件，渐渐成长为一个FireFox高级用户。

再后来FireFox被Chrome追赶，经过长期的思想斗争，终又换成了Chrome。从那以后，我彻底从一个保守派转变成追新族、版本帝。

捡当年这些陈芝麻烂谷子，是想说明一件事，人都讨厌改变，不愿走出舒适区，但这也意味着放弃了很多进步的机会，孰轻孰重，自己掂量。

既然我是追新族，为什么直到今天才迁移到Mac呢？其实我早有心换成Mac，但因为工作平台是Windows，换成Mac会带来诸多不便，故而举步不前。如今的工作有幸告别了Windows，才终得偿所愿。

想必有不少和我情况类似的朋友，多年来在Windows上积累了很多技巧和工具，心存不舍，迟迟下不了决心。那正好，本文的目的正是要打消这种顾虑。

#硬件篇

## 键盘

![](/img/2014/mac-guide-for-windows-power-user_keyboard.png)

Mac键盘和普通的PC键盘有些许差异，一上来是会有点不适应。下面来理一理。

首先，Mac键盘上没有Windows键，取而代之的是⌘(command键)。为了简便，下文中将Windows键写做win，command键写做cmd。在典型的PC键盘上，alt比win键更靠近空格，但在Mac上这两个键的位置对调了，command比alt更接近空格。

MacBook虽好，键盘手感还是比不了机械键盘，而绝大多数机械键盘都是标准的PC键盘，不适用于Mac，这对于习惯了外接机械键盘的我来说，是难以忍受的。还好机械键盘拆换键帽相对简单，于是我把alt和windows键拆下来对调了位置（下图）。

![](/img/2014/mac-guide-for-windows-power-user_cmd-alt-hard.png)

换完键帽看上去和Mac键盘一样了，此时按下alt，计算机会认为是cmd，按下cmd则会认为是alt，这不乱套了吗？没关系，在Mac的系统偏好设置中把它搞定。打开系统偏好设置，进入键盘设置，[修饰键...]设置，在弹出的窗体中首先选择你外接的键盘，然后更改cmd和alt的映射，如下图：

![](/img/2014/mac-guide-for-windows-power-user_cmd-alt-soft.png)

到此为止，cmd和alt就算对调完成了。键盘方面如果有其他问题，[在这里查看更多](http://support.apple.com/zh-cn/HT5636)。

# 鼠标 / 触控板

普通的USB鼠标插上就能用，但如果想拥有Mac触控板强大的手势功能，普通鼠标是不够的。苹果为Mac系统设计了专门的外设： [Magic Mouse](http://www.apple.com/cn/magicmouse/) (鼠标) 和 [Magic Trackpad](http://www.apple.com/cn/magictrackpad/) (触控板)，两个我都用过，个人感觉触控板的体验更好一些。因为鼠标的滑动手势和触控板的有区别，有时容易搞混。而用 Magic Trackpad，就和笔记本上自带的触控板手势完全一致。

Magic Mouse与Razer等游戏外设厂家出的鼠标相比，手感差很多，而Magic Trackpad绝对是一款顶尖的触控板。花同样多的钱，是买个三流鼠标还是买个一流触控板呢，自己来决定吧。

如果你对鼠标指针的精准和稳定要求特别高，并且手里已经有了一只牛逼的游戏鼠，那更好，因为两者可以共存，鼠标和触控板搭配使用就是了。

一定有人以为自己这辈子都用不惯触控板。我曾经就是这样的人。可能是我手太笨，在没有鼠标的时候，我都是用ThinkPad的小红点，并因为对小红点的依赖，从未离开过ThinkPad。可是当我用了一下Mac的触控板，世界观立即被颠覆。感谢它，让一个手笨的人找回了自信。


# 显示器

注重健康和工作效率的人，不会不知道大屏显示器的好处。还是那句话，MacBook再好，长时间使用还是应该抬起头来看大屏。

我的戴尔U2412M显示器已经用了快三年，依然表现出色。MacBook的Thunderbolt接口无法直接连上咋办呢，淘宝上随便买一个转接器就搞定了。

![](/img/2014/mac-guide-for-windows-power-user_display-adapter.png)

MacBook外接显示器，有一点新手要注意，就是笔记本必须要接电源，否则大屏幕不亮！必须吐槽一下，这设计太脑残了。

键盘、鼠标、显示器是追求生产力人士的三大件，坚决不能马虎。

#软件篇

很多Windows高级用户迟迟不敢迁到Mac，软件方面的障碍是罪魁祸首。总是担心换到Mac后，这个软件没有，那个功能不能用。下面就来将这些障碍一一扫除。

在Mac上安装软件一般有两个来源，一个是App Store，另一个是从软件的官网上直接下载安装包，这两个渠道相对安全放心。所以不要指望我告诉你在Mac上怎么装盗版。

软件有千千万万，这里只挑选我在Windows上必装的实用小工具，介绍一下它们在Mac平台的替代品。至于Mac独有的好工具，更是不胜枚举，本文完全cover不住，留作以后慢慢介绍吧。

## 电子书阅读器

看PDF，在Windows上我一直用Foxit Reader，Mac上我目前的选择是PDF Reader Pro Free，它能记住最近读过哪些书，以及每一本的阅读进度，挺实用。

epub格式的电子书，Windows上真没有什么像样的阅读器，Mac系统自带的iBooks就非常棒。

## 免费的Office

如果你不想用盗版，又想免费使用Office该怎么办？还真难住我了。

Mac上自带了一套办公软件iWork，和Office重合度相当高，不过对Office文档格式的兼容性上有问题，凑合着也能用。其中Pages相当于Word，Numbers相当于Excel，Keynotes相当于PowerPoint。Outlook呢？我推荐Foxmail，顺带提起Foxmail之父张小龙，是个传奇人物，他同时也是微信的缔造者。

iWork对Office文档的兼容性有挺多问题，对于搞不定的Office文件，用另一套免费的[Open Office](http://www.openoffice.org/download/index.html)试试看。对那些Office重度用户，推荐购买微软官方的[Office 365](http://office.microsoft.com/zh-cn/)，都能买得起Mac，也不差这点钱了。

## 截屏

我发现没事开着QQ，一大用途就是截屏，在Windows下按ctrl-alt-A，就能用QQ截屏，还能做简单的编辑。可Mac上的QQ没有这个功能，咋办呢？别忘了Mac上有微信啊亲！目前微信只在Mac才有哦。启动微信，按下ctrl-cmd-A试试看吧。

有人说至于吗，为了截个屏还要打开QQ微信。好吧，其实Mac系统自带的截屏工具也挺方便，快捷键如下：

cmd-shift-3：截全屏，图片立即保存到桌面
cmd-shift-4：矩形框选截屏区域，松开按键后保存到桌面
ctrl-cmd-shift-3：截全屏，图片立即保存到剪切板
ctrl-cmd-shift-4：矩形框选截屏区域，松开按键后保存到剪切板

矩形框选的时候，除了可以调整矩形大小，还可以按下空格键动态调整矩形的位置。这一点非常赞，因为当一上来确定的矩形顶点需要挪动的时候，这就是你的万能后悔药。

更新：经HX提醒发现，Mac的QQ是有截屏功能的，快捷键是ctrl-cmd-A，而且可以设置在不启动QQ主程序的时候保留截屏功能。与系统自带的截屏相比，除了可以编辑外，还可以在截屏松开鼠标后再调整矩形框，位置和大小都可以调。可以说这个功能一出，再也用不着系统自带的截屏了，QQ威武！


## 剪切板历史

无论Mac还是Windows的剪切板，都只保留最近一次剪切的内容。工作中我却经常要用到更早某次剪切的内容，咋办呢？

Windows平台的[ClipX](http://clipx.org/)帮你记录下剪切板的历史，有了它，妈妈再也不用担心我的剪切板被覆盖了！

Mac平台上的[ClipMenu](http://www.clipmenu.com/)一点也不输给ClipX，同样可以用快捷键直接呼出界面，文本图片全都支持，方便易用。


## Search everything

[Everything](http://www.voidtools.com/)出现之前，在Windows上找个文件真是费牛劲了，如果查找的范围太大几乎就别想找到了。

人们为此不得不定期整理文件夹，但说实话，整理的这些东西，绝大多数都属于历史，并将永久地属于历史了。花时间在这些将来几乎不会再用的东西上，就是浪费时间。毛主席说，浪费就是犯罪。

Everything在很短的时间内，为你的整个磁盘建好索引，只要输入名字的一部分，即可马上列出所有的匹配的文件和文件夹。

Spotlight可以说是Mac上的Everything，不过我用了这几天来看，有的也搜不到(难道是我打开的方式不对)，Alfred搜出来的结果要好一些。所以目前来看，还是更推荐Alfred。而且据说Alfred是一件神器，远不止搜索本地文件这么简单，值得好好研究研究。


## 资源管理器 vs Finder

用惯了Windows的资源管理器，切换到Mac的Finder还是有点不适应。Apple考虑到了这一点，所以特地准备了这篇[从 Windows 资源管理器到 Finder](http://support.apple.com/zh-cn/HT2512)。

作为一个被Windows惯坏了的用户，我觉得Mac的Finder有两个不太爽的地方。首先是地址栏默认不显示，无法知道当前所在的位置。解决的方法是，打开Finder，按alt-cmd-P即可切换地址栏的显示或隐藏。地址栏是在窗体最下方以图形形式展示，双击某个节点就是打开，在上面右键还可以看到更多操作。

另一个不爽的地方，是无法查看隐藏文件和文件夹。在Mac下，所有以小数点作为名字前缀的都是隐藏的，默认不显示。Windows也有隐藏文件，可以通过菜单设置让它们现出原形。但Mac下面没有图形化的设置界面，要通过命令行的方式设置。打开命令终端，输入：

  $ defaults write com.apple.Finder AppleShowAllFiles YES

这时候Finder还不会立刻显示隐藏项，需要重启Finder，方法是按住alt然后在Dock的Finder图标上点右键，在弹出的菜单中选择重新开启。


## 快捷键

快捷键方面，Mac和Windows的大同小异，而且和自然语言(英语)的结合更紧密，所以要更好记一些。以下是一些总结：

**光标移动**
ctrl-A        光标移动到行首(Ahead of line)，相当于win的Home键
ctrl-E        光标移动到行尾(End of line)
ctrl-F        光标向前(Forward)移动一个字符，相当于右箭头
ctrl-B        光标往回(Backward)移动一个字符，相当于左箭头
ctrl-D        删除(Delete)一个字符，相当于win的Delete键

**全选**
win: ctrl-A
mac: cmd-A

**选中连续项**
win: shift-点击
mac: shift-鼠标点击（限列表视图下）

**选中不连续的项**
win: ctrl-点击
mac: cmd-点击

**重命名**
win: F2
mac: 回车

**查看属性**
win: alt-Enter
mac: cmd-I (Info)

**最小化**
win: Win-向下箭头
mac: cmd-M (Minimize)

**关闭当前程序**
win: alt-F4
mac: cmd-Q (Quit)

**关闭当前标签页**
win: ctrl-W
mac: cmd-W

**保存**
win: ctrl-S
mac: cmd-S

**新建(窗口，文件等)**
win: ctrl-N
mac: cmd-N (New)

**打开(窗口，文件等)**
win: ctrl-O
mac: cmd-O (Open)

更多Mac下的快捷键，[请看这里](http://support.apple.com/zh-cn/HT201247)

还嫌不够？那就放出最后的大招[CheatSheet](http://www.grandtotal.biz/CheatSheet/)，安装后，当你进入一个程序，想看看有哪些快捷键可用，长按cmd键，便会将所有的快捷键呈现给你，相当神奇。

## 触发角

在Windows所有的快捷键里，我最喜欢的是锁屏快捷键win-L，一般都是在离开工位的时候按，所以特别爽。

Mac其实有更优雅的方法来锁屏，就是用触发角。当鼠标指针移到屏幕的四个角当中的任何一个，就可触发一个动作。这个动作可用是锁屏。具体方法是，打开系统偏好设置，桌面与系统保护程序，进入屏幕保护程序页，点击右下的触发角。

![](/img/2014/mac-guide-for-windows-power-user_trigger-corner-1.png)

![](/img/2014/mac-guide-for-windows-power-user_trigger-corner-2.png)

以后再离开工位时，不经意把鼠标往右下角一带，起身的同时屏保也开播了，一片星河璀璨，旁人看了以为是仙术，无不啧啧称奇。

从此江湖上有道：“锁屏拂袖去，深藏功与名”。

