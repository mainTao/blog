---
title:  Mac setup guide for developer
date: 2016-05-07 07:00:00
layout: post
style: code
tags:
---

还债。

去年吹的牛说要写三篇 Mac setup guide「一篇给普通用户，一篇给极客，一篇给开发者」。

前两篇一口气写完，第三篇却迟迟未动。

终于这次，被追着要一份装机清单，才把这事又提上日程。其实在这之前，偶尔也会想起第三篇还没写，对不住自己吹过的牛，但也仅止步于想起，止步于一次小小的愧疚，止步于懒癌。


<split></split>

## 显示隐藏文件/文件夹

在 Finder 里默认是不可见的，如果想在 Finder 里看到隐藏项，用命令行打开：

    $ defaults write com.apple.finder AppleShowAllFiles -bool true
    
打开后需要重启 Finder 才会生效，重启方法是按住 option 鼠标右击 Dock 上的 Finder 图标，选择「重新开启」

显示全部的隐藏项可能会让你的 Finder 看起来很杂乱，尤其 $HOME 目录，不喜欢的话可以再隐藏回去：

    $ defaults write com.apple.finder AppleShowAllFiles -bool false

## homebrew & homebrew-cask

下文将用到 homebrew 和 homebrew-cask 来安装软件:

安装 homebrew

    $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

安装 homebrew-cask
    
    $ brew tap caskroom/cask

注意：homebrew-cask 在2015年12月有一次重要更新，如果你在那之前安装的 homebrew-cask，可以这样做（谨慎！看完再动手）：

    $ brew uninstall --force brew-cask
    $ brew update
    
如果上面的 brew update 失败了，报 Error: /usr/local must be writable! 那么你就和我一样中招了，原因是升级了操作系统版本造成的，网上有说改目录权限可以解决，我试了一下反正不好使，而且改目录权限的做法路子太野不推荐。那咋办呢？卸载重装 homebrew！

    $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
    $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

卸载了以后，之前用 homebrew 安装的软件也就没有了，(用 cask 安装的会保留)！这些坑啊，苹果才是开发者最大的敌人。

用 brew-cask 安装的时候如果下载出了问题，可以清理一下，然后重试。清理的命令：

    $ brew cask cleanup

## Zsh

打开 Mac 的 terminal，默认的 shell 是 bash，推荐换成 zsh，最好安装完 zsh 以后再安别的，因为后续可能用到 .zshrc 文件。

    $ brew install zsh
    
安装 oh my zsh：

    $ sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
    
## iTerm2

Mac 自带的命令行程序 terminal.app 其实也够用，不过我推荐用更加强大的 iTerm2 替代它。

    $ brew cask install iterm2 

iTerm2 的默认色彩主题并不好看，[这里](http://iterm2colorschemes.com/)能下载到很多的色彩主题，挑一个自己喜欢的，如果有选择障碍就用主流的 Solarized Dark，下载它：

    $ curl https://raw.githubusercontent.com/mbadolato/iTerm2-Color-Schemes/master/schemes/Solarized%20Dark.itermcolors >  "Solarized Dark.itermcolors"
    
下载好主题以后，打开 iTerm2 的偏好设置，依次进入 Profiles / Default / Colors，在 load Presets 下拉框中选择 import 导入你想要使用的主题，例如 "Solarized Dark.itemcolors"。导入后在 load Presets 下拉框中选择它就生效了。
    
## Git

Mac 自带的 Git 版本旧了一些，想用最新的 Git 还是得自己安装：
 
    $ brew install git
    
Mac 自带的 Git 在 /usr/bin/git，而 homebrew 会把新的 Git 安装在 /usr/local/bin/git

Mac 里有个讨厌的东西 .DS_Store (英文全称 Desktop Services Store)，用来存储目录的自定义属性，例如文件的图标位置。对我来说真没啥用处，但它会不停地自动生成出来，尤其每次都提交到 .git 里简直烦死了。下面就介绍两个能根治的偏方：

偏方一，在 $HOME 目录创建一个 .gitignore，把 .DS_Store 加进去，这样就不用在每个项目都把 .DS_Store 手动加到 .gitignore 文件里了。

偏方二，阻止系统自动生成 .DS_Store：

    $ defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool TRUE
 
恢复自动生成的命令：

    $ defaults delete com.apple.desktopservices DSDontWriteNetworkStores


## 装机清单
    
开发者的装机必备里，每一个软件都足够写一个长篇了。这里仅列出我个人的装机列表。

    $ brew update
    $ brew install zsh
    $ brew install wget
    $ brew install node
    
    $ brew cask install iterm2
    $ brew cask install seil
    $ brew cask install go2shell
    $ brew cask install sogouinput
    $ brew cask install evernote
    $ brew cask install google-chrome 
    $ brew cask install firefox
    $ brew cask install chromium
    $ brew cask install postman
    $ brew cask install sequel-pro
    $ brew cask install robomongo
    $ brew cask install charles
    $ brew cask install webstorm
    $ brew cask install android-studio
    
有些软件用 brew 安装的时候，会报下载失败并会告诉下载地址，如果下载地址来自 GitHub 或者 SourceForge，那几乎可以肯定是遇到了伟大的火墙，可以想办法翻墙，这时候可以考虑通过其他渠道安装。

EOF

<split></split>

[Mac setup guide for common user](/2015/mac-setup-guide-for-common-user/)
[Mac setup guide for geek](/2015/mac-setup-guide-for-geek/)
