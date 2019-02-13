---
title: VS Code 快捷键
date: 2018-09-28 07:00:00
layout: post
style: code
---

纳德拉担任微软 CEO 以来，微软在开发者心中的形象开始慢慢好转。人还是 MS 那批人，做事却不像以前的 M$ 了。例如对开源社区的贡献排到世界前列，花重金收购了 GitHub。和开发者关系最大的，还要属推出 VS Code 这款产品。

我是 JetBrains 公司的拥趸，2012 年就是它们的付费用户。时至今日，JetBrains 的 IDE 依然是最棒的。然而 VS Code 这股势力不可小觑，轻便又免费，赢得了开发者的青睐。这个领域的法则很简单，就是得人心者得天下，社区贡献给 VS Code 提供很大助力，超越 JetBrains 指日可待。

本文重点介绍 VS Code 快捷键相关的知识点。

## 首先要了解的快捷键：⇧⌘P
那么多快捷键，先学哪个呢？试试 ⇧⌘P，其中的 P 代表英文 Command Palette 中的 Palette。知道英文原文，就容易记住快捷键。

网上教程大多是英语的，建议把语言设置成英语。方法是 ⇧⌘P，如下图：

![](http://cdn.maintao.com/blog/img/2018/vscode-shortcut/1.png)


在输入框里输入关键词「显示语言」，匹配到「配置显示语言」命令，按回车，打开 `locale.json` 文件。然后编辑文件，改成 en-us，重启后生效。

界面变成英语后，再想打开刚才编辑的`locale.json`文件，搜索「显示语言」就不灵了，而要输入英语 display language。

![](http://cdn.maintao.com/blog/img/2018/vscode-shortcut/2.png)

所以你看语言有多重要，如果你用的中文，在网上找到了英文资料，连关键词都搜不到，你说闹心不闹心。

## 自定义快捷键
所有的命令都可以在 Command Palette 里找到并触发。其中有些命令配有快捷键，那就无须打开 Command Palette，而可以直接通过快捷键触发。还有很多命令并没有快捷键，好消息是，我们可以自由地给它分配快捷键。

如何查看和编辑快捷键呢？我们试着打开 Command Palette，输入 keyboard 看看会找到什么：
![](http://cdn.maintao.com/blog/img/2018/vscode-shortcut/3.png)

貌似就是这个 Open Keyboard Shortcuts。留意右边的 ⌘K ⌘S，是该命令的快捷键。这个快捷键要怎么按呢？最直观的理解是：同时按下 ⌘ 和 K，然后再同时按下 ⌘ 和 S。这样按倒是没问题，不过可以更简单：按住 ⌘ 不松开，然后依次按下 K 和 S。

按下 ⌘K ⌘S 后就打开了快捷键面板，是一个带搜索功能的表格：

![](http://cdn.maintao.com/blog/img/2018/vscode-shortcut/4.png)

表格有四列，解释一下：
* Command：这个命令是做什么用的
* Keybinding：按什么快捷键可以触发命令
* Source：值为 Default 表示系统默认，值为 User 表示用户自定义
* When：在何种条件下才能触发，细节参考 [when-clause-contexts](https://code.visualstudio.com/docs/getstarted/keybindings#_when-clause-contexts)

上图中标红的`keybindings.json`可点击，打开后左右并排显示两个文件，长这样：

![](http://cdn.maintao.com/blog/img/2018/vscode-shortcut/5.png)

左边是只读文件 Default Keybindings，右边才是可编辑的文件`keybindings.json`。

先说左边的 Default Keybindings，里面有默认的全部快捷键的详细定义，还列举出了所有默认未绑定快捷键的命令。这些未绑定快捷的野命令到哪里找呢？滚到文件中大约一千多行的位置：

![](http://cdn.maintao.com/blog/img/2018/vscode-shortcut/6.png)

可以看到，文件一分为二，上半部分是默认绑定了快捷键的，下半部分（从注释开始）是默认没绑快捷键的。这样比较方便我们集中查看哪些命令没绑快捷键，需要的话可以自定义快捷键。

这里说一个原则，就是考虑到通用性，尽量不要修改已有的快捷键。因为别人可能在你的电脑上写代码，你也可能在别人电脑上写代码，不一致的话会很尴尬。

## keybindings.json
上面说了，`keybindings.json`里包含了所有用户自定义的改动。但这个文件也不能乱写，要遵守套路。

一个典型的自定义命令：
```json
    {
        "key": "cmd+m cmd+v",
        "command": "toggleVim",
        "when": "editorTextFocus && !inDebugRepl"
    }
```

### 套路一：key 不能乱写
一个按键，在 JSON 里写成啥？cmd 还是 ⌘？\n 还是 enter？都是有规定的，这些在 [accept keys](https://code.visualstudio.com/docs/getstarted/keybindings#_accepted-keys) 里面做了说明，写之前最好参考一下。

### 套路二：command 不能胡编
Command 不就是个字符串吗？我能不能自己编一个 Command，比如叫 `haha` 然后给它分配个快捷键呢？要回答这个问题，得先去 Default Keybindings 里找找有没有这个命令。如果没有，就不可以。否则就算你定义了 `haha` 这个命令，快捷键触发的时候右下角也会提示 Command ‘haha’ not found.

### 套路三：when
When 学起来还是比较麻烦的，尽量别修改。如果要修改，唯一的方法就是直接在`keybindings.json`里手写。至于怎么写， [when-clause-contexts](https://code.visualstudio.com/docs/getstarted/keybindings#_when-clause-contexts)有详细的说明。

### 套路四：注意冲突和顺序
如果你想知道一个快捷键已经被哪些命令占用了，可以 ⌘K ⌘S 打开 Keyboard Shortcuts，输入快捷键，例如 cmd+v，那么与之匹配的命令都会列出来，匹配部分还会高亮（如下图）：

![](http://cdn.maintao.com/blog/img/2018/vscode-shortcut/7.png)

若快捷键相同，When 条件也一样，那么就会有冲突。其实快捷键「相同」这个说法还是不够严格。比如有一个快捷键是 ⌘V ⌘I，就与已有的快捷键 ⌘V 冲突了。因为当按下 ⌘V 以后，它仍然在等后面可能出现的 ⌘I，就不会执行 ⌘V 对应的命令了。

因此严格来说：只要出现了 A 和 AB 这样的快捷键（一个快捷键的前半段包含了另一个快捷键），且触发条件一致，就会引发冲突。

### 套路五：快捷键与命令是多对多关系

* 一个命令可以有 0 ~ N 个快捷键，按哪个都可以触发。
* 一个快捷键可以有 1 ~ N 个命令，根据 when 去判断触发哪个命令。

由于默认快捷键文件不能修改，所以无论新增、删除、修改快捷键，都要在 `keybindings.json` 里记录。

最开始，`keybindings.json` 里的数组是空的。

新增：就是往数组中添加一条原本没有快捷键。
删除：还是往数组中添加一条，只不过命令名称前有个减号。
修改：先做删除，再做新增，也就是要往数组中添加两条。

自己试着改几个快捷键，很快就明白了。

看完上面这些，如果觉得还不够，最全的资料在这里：[Visual Studio Code Key Bindings](https://code.visualstudio.com/docs/getstarted/keybindings)

