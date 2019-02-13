---
title: 我的 VS Code 快捷键配置
date: 2018-10-21 07:00:00
layout: post
style: code
---

上一篇介绍了[VS Code 快捷键](https://maintao.com/2018/vscode-shortcut/)，这次就整理一下我自己的快捷键配置。

刚工作的时候学习了 Vim，这些年更换过多个编辑器，几乎每个编辑器都有 Vim 插件，所以依旧使用 Vim 的那一套快捷键。这样的一个好处是，无论怎么切换 IDE，基础的文本编辑习惯都可沿用下来。

用 Vim 的另一个好处，就是学新的 IDE 可以少记一些快捷键，比如删除当前行、比如跳转到定义。剩下的快捷键需要改的就不多了，能用默认尽量用默认，选择自定义要有充足的理由。

## Toggle Mini Map
小地图还是有点小用，但有时候也嫌烦，需要一个快捷键来隐藏/显示小地图。
```js
    {
        "key": "cmd+m cmd+m",
        "command": "editor.action.toggleMinimap"
    },
```

## Toggle Vim Mode
当不会 Vim 的人用你电脑的时候……
```js
    {
        "key": "cmd+m cmd+v",
        "command": "toggleVim",
        "when": "editorTextFocus && !inDebugRepl"
    },
```

## Disable Vim cmd+V
往编辑器里粘代码，不用 cmd+V 用什么？
```js
    {
        "key": "cmd+v",
        "command": "-extension.vim_cmd+v",
        "when": "editorTextFocus && vim.active && vim.overrideCmdV && vim.use<D-v> && !inDebugRepl"
    },
```

## Disable Vim Backspace
如果不禁掉这个，在 code snippet 里用退格键会发生错乱，算是人为避开一个 bug 吧。
```js
    {
        "key": "backspace",
        "command": "-extension.vim_backspace",
        "when": "editorTextFocus && vim.active && !inDebugRepl"
    },
```

## Reference Search
默认的 shift + F12 太不好按了，简单八一八，不需要那么复杂。
```js
    {
        "key": "cmd+8",
        "command": "editor.action.referenceSearch.trigger",
        "when": "editorHasReferenceProvider && editorTextFocus && !inReferenceSearchEditor && !isInEmbeddedEditor"
    },
```

## Trigger Suggest
提示很重要，但默认的 ctrl+space 要么触发 Mac 的 spotlight，要么触发输入法切换。 改成 shift+space 就妥了。
```js
    {
        "key": "shift+space",
        "command": "editor.action.triggerSuggest",
        "when": "editorHasCompletionItemProvider && textInputFocus && !editorReadonly"
    },
    {
        "key": "ctrl+space",
        "command": "-editor.action.triggerSuggest",
        "when": "editorHasCompletionItemProvider && textInputFocus && !editorReadonly"
    },
```

## Reset Zoom
外接投影或者有人在旁边看代码的时候，经常需要放大字体。按 ⌘+ 逐级放大，演示完后再按 ⌘- 逐级缩小还原回去。这里就有个痛点，就是在逐级缩小还原的时候，每按一下都要用眼睛确认是不是到了默认大小，有的时候还不太确定。浏览器可以用快捷键 cmd+0 来重置缩放，我们就用和浏览器一样的快捷键。
```js
{
    "key": "cmd+0",
    "command": "workbench.action.zoomReset"
},
```

## Zen Mode
这么赞的功能，默认快捷键 cmd+K, Z 太繁琐，会影响进入写代码状态的流畅感，用 cmd+E 容易按得多。cmd+E 的默认行为貌似和 cmd+F 没有区别，果断移除。
```js
    {
        "key": "cmd+e",
        "command": "-actions.findWithSelection"
    },
    {
        "key": "cmd+e",
        "command": "workbench.action.toggleZenMode"
    }
```