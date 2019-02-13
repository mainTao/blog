---
title: Emoji in programming
date: 2015-10-28 07:00:00
layout: post
style: code
tags: 
---

Emoji 就是表情符号，在[百度百科](http://baike.baidu.com/item/emoji)和[36氪](http://36kr.com/p/212997.html)都有介绍，我就不罗嗦了。本文主要讲编程时遇到的 emoji 相关的坑。从前端到后端均会涉及。

Emoji 其实没有什么神秘的，以前也有一些特殊的字符，比如☆①②，在键盘上直接敲不出来，那怎么输入呢？要么找到输入法或编辑器中的此项功能插入进来，要么从网上搜索到然后拷贝过来。本质上，emoji 就是一个 unicode 字符，只不过它还比较新，好多地方还不支持，即使支持也是形态各异。从目前各家厂商支持的情况来看，苹果是最用心的。


## 浏览器里的 emoji

读了这篇 [Parsing emoji Unicode in JavaScript](http://crocodillon.com/blog/parsing-emoji-unicode-in-javascript) 之后，顿时感觉在前端方面没什么留给我好写的了。

只再强调几点：

JavaScript 的字符都是 utf-16 编码的，也就是用两个字节来表示一个字符。emoji 的范围是 u1f600-u1f64f 显然超出了两个字节，也就是说必须用两个字符才能放得下。例如“哈哈笑”的 unicode codePoint 是 u1f604，那么它会占用两个字符，charCode 分别是 d83d 和 de04，如下：

```javascript
'😄'.length === 2;

'\ud83d\ude04' === '😄';
escape('😄') === '%uD83D%uDE04';
unescape('%uD83D%uDE04') === '😄';

'😄'.charCodeAt(0).toString(16) === 'd83d';
'😄'.charCodeAt(1).toString(16) === 'de04';

'😄'.codePointAt(0).toString(16) === '1f604';

```

检测浏览器是否支持 emoji 的方法：
```javascript
function emojiSupported() {
  var node = document.createElement('canvas');
  if (!node.getContext
    || !node.getContext('2d')
    || typeof node.getContext('2d').fillText !== 'function'){
    return false;
  }
  var ctx = node.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '32px Arial';
  ctx.fillText('\ud83d\ude03', 0, 0);
  return ctx.getImageData(16, 16, 1, 1).data[0] !== 0;
}
```

JS 匹配 emoji 的正则表达式: 

    /\ud83d[\ude00-\ude4f]/g


## Node.js (Express) 里的 emoji

Node.js 其实说白了还是 JavaScript，和浏览器里的没啥区别。只是做 Node.js 很多都会用到 Express，那么恭喜你要踩坑了：通过 HTTP 发来的 emoji 会导致 Express 崩溃，目前还没有好的解决办法。

不过幸好我可以通过 WebSocket 发送，最终绕过去了。还有个变通的方法是用 escape 函数将文本转码，但转码之后非英文字符都变得不可读。

## 数据库存储 emoji

良心一点儿的数据库，比如 PostgreSQL 和 MongoDB，默认都支持 emoji。挫一点的数据库，如 MySQL，则需要特殊配置才能支持，否则在插入带 emoji 的数据时会报错。究其原因，MySQL 使用的字符集是最多三个字节的 utf8。

一个 utf8 字符可以包含 1 到 4 个字节，通常情况下在 3 个以内。不巧的是，emoji 用到了第 4 个字节，也就是需要 utf8mb4 的支持，而 MySQL 默认支持的是 3 个字节以内的，于是就出了问题。

下面说说如何让 MySQL 支持 emoji。

修改服务端配置文件 /etc/mysql/my.cnf
    
    [client]
    default-character-set = utf8mb4
    
    [mysql]
    default-character-set = utf8mb4
    
    [mysqld]
    character-set-client-handshake = FALSE
    character-set-server = utf8mb4
    collation-server = utf8mb4_unicode_ci
    
修改完后重启 MySQL 服务。

    $ service mysql restart
    
然后把对应的库或者表改成 utf8mb4 的格式：

    mysql> ALTER DATABASE your_database_name CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
    mysql> ALTER TABLE your_table_name CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

此时通过客户端连接到 MySQL 数据库，就可以存 emoji 了。但是用客户端还是不行。
    
客户端配置：

以 npm 的 mysql 包为例，建立数据库连接的选项里指定 charset：

    charset: 'UTF8MB4_GENERAL_CI'

如果还没有解决问题，或者想了解更多，请移步[这里](https://mathiasbynens.be/notes/mysql-utf8mb4)。

## emojipedia

最后给大家推荐一个良心网站 [emojipedia](http://emojipedia.org/)。上面除了罗列出所有的 emoji，还提供搜索功能。

比如搜索 fuck 可以得到 Reversed Hand With Middle Finger Extended 的结果，还是很善解人意的 :)


