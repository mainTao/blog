---
title: 阿里云 OSS 客户端直传（配置篇）
date: 2017-12-14 07:00:00
layout: post
style: code
---

以前上传文件，惯用套路是上传到自己的服务器再上传到 OSS，现在随着一整套云服务的普及，直接上传到 OSS 明显更有优势。

优势有这么几个：
1. 速度快：因为传输次数由两次减为一次
2. 少花钱：因为不占用自己服务器的网络带宽
3. 少干活：在服务器端，上传其实有很多讲究的，比如限制文件大小、断点续传、临时文件的接收、发送、清理

初次使用还挺复杂，概念也比较多。本文将从零开始，一步一步走完整个流程。

## 创建 Bucket

首先在 OSS 栏目里新建一个存储空间（即 Bucket）。起个名字，例如叫做 a-bucket-for-test（这个名字在「华北 2」区已经被我占了，你只能起一个不同的名字，因为每一个 bucket 都会独占一个域名，例如 a-bucket-for-test.oss-cn-beijing.aliyuncs.com）

![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/1.png)

![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/2.png)

新建 bucket 的时候需要指定存储类型，如果是图片或音视频这种不希望加载太慢的，就选默认的「标准存储」。

### Bucket 读写权限的选择

* 公共读：比如你放一个文件上去，希望所有知道 URL 的人都可以下载，就用它。
* 私有：如果需要限制访问者，只准授权的人才可以访问，虽然开发起来比较繁琐，但保存私有文件选它是必须的。
* 公共读写：切记千万不要选它，公共读写意味着任何人可以往上传文件，占空间浪费钱事小，万一有谁上传了非法内容，责任担不起。

读写权限除了在新建 bucket 时指定，也可以事后修改，在「基础设置」里，如下图所示：

![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/3.png)

### 跨域设置
如果要在浏览器里直传文件到 OSS，则需要设置跨域。浏览器的这个规则是为了安全而牺牲便利的又一个例子。如果你不了解跨域，可以阅读[阿里云的文档](https://help.aliyun.com/document_detail/31870.html)。
![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/4.png)

跨域规则照这么设置：

![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/5.png)




## 创建用户
为什么要新建一个用户？阿里云的主用户拥有最高权限，就像 Unix 系统的 root 用户一样，考虑安全因素不建议业务直接使用。推荐做法是给每个业务创建一个子用户，一旦业务下线或者权限变动，改起来都很省心。

下面来看如何在阿里云新建一个用户。

### 进入用户管理

打开管理控制台，进入 [访问控制 / 用户管理](https://ram.console.aliyun.com/#/user/list)
![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/6.png)

### 填写用户信息
新建用户，起一个用户名（例如我这里叫 album），记得勾选底下生成 AccessKey。

![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/7.png)

### 保存 AccessKey
由于 AccessKey 详情属于机密，所以新建用户后，默认并不显示，需要点击下拉箭头才显示。同时也提供了下载的功能，点击「保存 AK 信息」浏览器会下载一个 csv 文件，里面是 AccessKey 的内容。

![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/8.png)

AccessKeySecret，一定保管好了，因为阿里云考虑到安全性不提供从控制台页面查看 AccessKeySecret 的方法，所以一旦自己弄丢了 AccessKeySecret 就只能重新生成一个新的替换掉旧的。

## 用户授权

创建完用户后，回到 [用户管理页面](https://ram.console.aliyun.com/#/user/list) ，在用户列表中点击「授权」

![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/9.png)

从左侧列表中选择 AliyunOSSFullAccess，点击向右箭头加入右侧的已授权策略列表，点「确定」生效。
![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/10.png)

### 更精细的授权

以上我们创建了一个用户，并授予这个用户 OSS 的读写权限。注意，此时用户拥有 OSS 上全部 bucket 的读写权限。如果你觉得这样不够安全，可进一步缩小权限，例如只能读写某一个 bucket，甚至仅限某一个 bucket 下的某一个目录。

如此细粒度的授权必然需要自定义了，打开策略管理页面，选择「自定义授权策略」标签页，点击「新建授权策略」。

![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/11.png)

创建自定义授权策略分三步：STEP 1 是选择一个策略模板，这里我们直接选择从空白模板创建。STEP 2 最复杂，即编写 JSON 格式的策略内容。如果没有工具完全从零开始写，也太难为人了。还好阿里云提供了一个在线的策略编辑器 [RAM Policy Editor](https://gosspublic.alicdn.com/ram-policy-editor/index.html)，长这样：

![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/12.png)

通过在编辑器上选择、填写一些简单信息，就能生成出 JSON 格式的授权策略。假设我们的目标是：让用户拥有 a-bucket-for-test 这个 bucket 中 album 目录下所有文件的读写权限。如何操作呢？
1. Effect 选择 Allow
2. Actions 选择 oss:*  ，意为 OSS 的所有权限（PUT+GET+LIST）
3. Resources 填写 a-bucket-for-test/album/*，意为 a-bucket-for-test 这个 bucket 中 album 目录下所有的内容，注意最后的星号不能漏掉。

点击「添加规则」按钮，便会在右边生成好 JSON，把它粘贴进 STEP 2 底下的文本框里，如下：

![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/13.png)

创建完自定义授权策略后（给它起的名字是 demo-policy），我们需要把它授予上文中创建的用户 album。还是回到用户列表，在 album 的那一行点击授权，然后编辑：

![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/14.png)

由于之前我们已经授予了 album 用户 AliyunOSSFullAccess 策略，所以需要收回这个策略（选中它然后点向左的箭头），然后授予它新的 demo-policy 策略（选中它然后点向右的箭头）。编辑完成后如下图所示：

![](http://cdn.maintao.com/blog/img/2017/aliyun-oss-upload-config/15.png)

## 总结
让我们回顾一下本文的内容：
1. 创建一个 Bucket: a-bucket-for-test
2. 创建一个用户：album
3. 创建一个自定义授权策略：demo-policy
4. 将 demo-policy 授予用户 album

以上就是需要在阿里云控制台配置的全部步骤了。关于代码部分，因为篇幅所限，以后会单独写一篇，先把代码搁在这里 [aliyun-oss-upload-demo](https://github.com/mainTao/aliyun-oss-upload-demo)，着急的可以看。因为今年的博客只剩下最后一篇了，只好放到明年。

