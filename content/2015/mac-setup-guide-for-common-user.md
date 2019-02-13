---
title:  Mac setup guide for common user
date: 2015-08-14 07:00:00
layout: post
style: code
tags:
---

去年十一月我买了第一台苹果笔记本，13 寸的 MacBook Air 2014。今年六月因为换工作的原因，又有了一台 13 寸的 MacBook Pro 2015。

面对一个干干净净的系统，还都是有点小激动的，并且每次装电脑都有新的发现。去年第一次使用 Mac，留下一篇[写给Windows高级用户的Mac指南](http://www.maintao.com/2014/mac-guide-for-windows-power-user/)。这次把 Pro 折腾完一遍，发现之前的那篇不够用了，于是再写三篇，一篇给普通用户，一篇给极客，一篇给开发者。本文是写给普通用户的，老少咸宜。

## 触控板设置

### 轻拍来点按

默认是要按下触控板听到响声才触发点击。这明显是防止小白误触而设计的，很费劲很低效，任何一个有尊严的成年用户都不应该接受这样的设置。苹果知道这一点，所以可以设置成轻拍来表示鼠标点击，而不是按下去。

在系统设置里选择触控板，后面看图就不用我说了。

![](/img/2015/mac-setup-guide-for-common-user_tap.png)

### 三指拖移

默认的拖动是一根手指按下触控板，另一根手指在触控板上滑动。这样有个前提，就是只有当两只手都能操作触控板才不感到别扭，例如左手大拇指按下触控板，右手食指负责滑动。在笔记本上还好，可如果用单独的蓝牙触控板，通常放在键盘的右侧，就只有右手够得到，单手操作起来太困难了。所以需要开启「三指拖移」功能。

然而，开启「三指拖移」在我这个带有 Force Touch 功能的 MacBook 上特别难找！在系统设置的「辅助功能」里，列表中找「鼠标与触控板」，然后点「触控板选项...」按钮。如下图：

![](/img/2015/mac-setup-guide-for-common-user_drag.png)

## Mission Control

也许你用了很长一段时间 Mac，竟不知 Mission Control 为何物。其实当你按下 cmd + tab 切换程序的时候，就已经在用它了。

Mission Control 的功能比较杂，用好用不好差别很大。先上图：

![](/img/2015/mac-setup-guide-for-common-user_mission-control.png)

这是我的自定义设置，有好几处修改。逐个来说。

### F11, F12 的功能

默认 F11 是显示桌面，F12 是显示 Dashboard。其实 Mac 的桌面和 Dashboard 并没多大用处，占了这两个键实在是浪费。加上修饰键 shift 就好多了。

### 禁止 Spaces 自动重排

这里说的 space 不是空格键，而是 Mac 的虚拟桌面空间。有了它，就可以快捷地在不同的工作区切换，以前 Windows 没有这项功能实在可惜，不过从 Windows 10 开始也会有了。

在触控板上四指滑动，或者按 「ctrl + 左或右方向键」，就会切换到左右相邻的 space。

按下 cmd + tab 会在应用程序之间切换，却不一定会切换 space，即使切换了也未必是相邻的 space，有点绕脑。

其实我们在平常使用的时候，一般不会开太多个 space，而且我很在意 space 之间的左右顺序，因为有固定的顺序会让我在切换时更有方向感。
默认系统会根据最近使用了哪些 space 自动重排，这会打乱原有的顺序，很不爽，禁掉。

### Dashboard 层叠显示

Dashboard 就是一个鸡肋。默认情况下，这个鸡肋还要占用一个 space，太浪费。如果舍不得关掉它，就让它以浮窗的形式显示，而不要独占一个 space。

### 触发角

上面的图中，左下角有个触发角按钮。以前写过一篇文章，专门讲了[怎样用触发角来设置锁屏](http://www.maintao.com/2014/mac-guide-for-windows-power-user/#触发角)。不是我故意老调重弹，只因为触发角实在太好用了。

## Finder 设置

恐怕有不少的 Windows 用户是因为 Finder 而对 Mac 无爱。举个例子，Finder 里选中一个文件后，回车竟然不是打开文件，而是重命名文件……奇怪的逻辑。下面就来补一补这块短板。

### Finder 偏好设置

打开 Finder，从顶部的菜单进入偏好设置（不在系统设置里），要改的地方很多，直接上图：

![](/img/2015/mac-setup-guide-for-common-user_finder-general.png)

![](/img/2015/mac-setup-guide-for-common-user_finder-sidebar.png)

![](/img/2015/mac-setup-guide-for-common-user_finder-advanced.png)

工具栏也很不给力，在工具栏的空白处右键鼠标，选择自定义工具栏，然后在通过拖动来增减工具以及排序。见下图：

![](/img/2015/mac-setup-guide-for-common-user_finder-toolbar.png)

地址栏和状态栏也很需要，默认都是隐藏的，如何显示呢？在顶部的「显示」菜单里进行设置。

做完上面这一大堆设置后，可能还觉得有些地方不方便，那看来有必要向完美主义加强迫症的你推荐一件神器： [XtraFinder](http://www.trankynam.com/xtrafinder)。

XtraFinder 对 Windows 用户十分友好，可以按回车打开文件，可以见到熟悉的返回上层目录按钮，再具体的就自己去了解吧，包您满意。

## 工具软件
 
### Paste

作为一个整天复制粘贴、粘贴复制的人，我试用过几款记录剪切板历史的软件，最终选择了 [Paste](http://pasteapp.me/)。 

### Parallels Desktop 

有些时候没有 Windows 还真过不下去，[Parallels Desktop](http://www.parallels.com/cn/products/desktop) 是 Mac 上最好的虚拟机，没有之一。具体怎么个好法，不告诉你。

### 1Password

这个更没什么说的了，账号太多密码记不过来的土豪，一定花钱把它买了。

是的，要花钱买！上面推荐的这三个工具软件都要花钱买！没钱？没钱用毛苹果！


<hr>

### 睡眠习惯培养
本来上周说好要记录睡眠时间，可是天有不测风云，小米手环识别不出来了。结果一溃千里，睡得完全没有规律，乱套了。下周起，没有手环就没有吧，一样可以记录时间。根源还是重视的程度不够。

