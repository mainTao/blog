---
title: 阿里云 OSS 和 CDN 配合使用心得
date: 2018-02-28 07:00:00
layout: post
style: code
---

OSS 一般是要和 CDN 配合使用。如何在阿里云后台给 OSS 绑定 CDN 加速域名，网上有很多资料就不再赘述了。本文重点要讲的是，在完成绑定后，接下来可能需要解决的几件事。

## 开启 HTTPS
以后越来越多的平台会强制要求 HTTPS。开启 HTTPS 的好处当然就是安全，坏处是加解密会带来额外开销，这个开销最直接的体现就是在费用上。

开启 CDN 的 HTTPS 支持需要以下三步：

1. [CDN](https://cdn.console.aliyun.com) > 域名管理
2. 进入某条域名的详情页
3. HTTPS设置 > 修改配置

![](http://cdn.maintao.com/blog/img/2018/aliyun-oss-cdn-tips/1.png)

选择证书，可以上传自己的证书，也可以用阿里云的云盾证书。如果经济条件允许建议用阿里云的，免去一些麻烦。

在这一页底下可以设置强制跳转，有三种类型：
* 默认：不跳转，原来是什么协议还保持什么协议
* HTTPS -> HTTP：省钱做法
* HTTP -> HTTPS：土豪做法

## 私有 bucket 的 CDN 设置
私有 bucket 不允许未授权的访问，如果要访问私有资源 URL 后面须加上鉴权参数。鉴权参数肯定要经常变，否则就不安全了，可一旦鉴权参数变了 URL 也就和之前不一样了，CDN 不又要回源吗？

CDN 节点根据 URL 来判断资源存不存在本地，如果是一个从未见过的 URL，当然就认为资源不存在 CDN 节点上，就要从源服务器拉取。

但私有文件怎能允许随便拉取？是要访问权限的。还好阿里云的 CDN 有这项功能。

(1) 开启私有 Bucket 回源

![](http://cdn.maintao.com/blog/img/2018/aliyun-oss-cdn-tips/2.png)

同样是在 CDN 的域名管理配置页面，有个「私有 Bucket 回源」，进去后开启私有 Bucket 回源。

(2) 鉴权配置

![](http://cdn.maintao.com/blog/img/2018/aliyun-oss-cdn-tips/3.png)

私有 Bucket 的资源是需要鉴权参数的，访问 OSS 时须在 URL 后面加上鉴权参数。访问 CDN 也一样，只是鉴权的操作前置到 CDN 上去做。

CDN 鉴权一来可以保证安全，二来也依然可以加速，因为鉴权后 URL 就还原成不带参数的样子，就不会因为URL的不同而每次都回源。

鉴权有 A、B、C 三种方式， 没太大差别。主备两个秘钥注意好保密。什么时候需要用到备用秘钥呢？就是在更换秘钥时避免无法解密旧的秘钥的尴尬。比如要更换主秘钥之前，就设置一个备秘钥，此时两个秘钥都起作用。然后客户端新的请求都用备秘钥进行加密。等到用主秘钥加密的 URL 都不再用了（比如鉴权参数限制时间是一小时，前端换成备秘钥加密后已经过去了一个小时），再把主密钥替换成新的，就万无一失了。

关于鉴权配置的技术细节，可参考[阿里云的官方文档](https://help.aliyun.com/document_detail/27135.html?spm=5176.8232292.domaindetail.31.f67ce4cJ5PAPp)。

## 缓存预热
存储在 OSS 上的文件，一开始并不在 CDN 上。当文件第一次被访问时，CDN 发现本地没有这个文件，就回源到 OSS 去把文件拉取到 CDN 上，之后再访问就不用回源了，直接拿 CDN 本地的文件就好了。

第一次访问 CDN 上的速度因为要回源，会非常慢。为提升首次加载的速度，于是有了缓存预热功能。缓存预热就是把源站的文件提前下载到各个 CDN 节点。

这里的「各个 CDN 节点」有必要说明一下：
- 预热能覆盖的 CDN 节点是 L2 级的，离用户最近的 L1 并不会覆盖到。
- 默认只有中国大陆的 CDN 节点才会被预热，海外的也不是不可以，需要达到一定的阿里云会员等级才能申请开通。

最大的问题是，缓存预热不能大规模使用，目前阿里云限制每天只能预热 2000 个文件。

超出了 2000 上限怎么办呢？只能模拟客户端下载，而且要老老实实地下载完。比如你下载了 10%，这时候客户端退出了，那么剩余的 90% 不会自动下载到 CDN 上。再次下载的时候会观察到，前 10% 下载得非常快，因为在 CDN 上已经有了，之后速度突然下降，因为是一边回源一边下载。模拟客户端下载没有次数限制，但它的劣势是不能全网预热，只能预热模拟的客户端所在地区的节点。

缓存预热需要等多长时间？我实测了一下，预热一个 4.3 MB 的文件预热了 135 秒，预热速度大约是 32KB/s，还是挺慢的。所以一般分享照片的话，预热三分钟以上才相对保险。而预热成功之前，直接通过 OSS 的地址下载要比从 CDN 下载更快。

[缓存预热接口](https://help.aliyun.com/document_detail/27201.html)需要有 AliyunCDNFullAccess 权限，记得提前分配，否则报 403。
