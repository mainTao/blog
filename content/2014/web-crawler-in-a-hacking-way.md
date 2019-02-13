---
title: Web crawler in a hacking way
date: 2014-07-14 07:40:02
layout: post
style: code
tags:
- curl
- crawler
- 云计算
---

最近想从某网站抓取一些数据下来分析。一开始打算自己写代码实现，到网上转悠了转悠，发现两个可以直接拿来做爬虫的工具，curl和wget。

wget能递归爬取整个网站，虽然强大，但我没有这需求。我要抓取的页面地址很规范，所以掂量了掂量，觉得还是更符合Unix命令行习惯的curl合适一些。

##curl介绍

curl的基本用法

    $ curl <URL>

抓取到的HTML会直接输出到stdout，也就是控制台。如果熟悉unix命令，不用说你也知道如何下载到文件：

    $ curl URL > raw_file

下载好文件，下一步就是解析文件。如果你不想保存原始页面，只想保存解析好的数据，就让你的parser从stdin读取内容，这样可以用上unix的管道：

    $ curl URL | parser > parsed_file

上面的写法虽然优雅，但我更希望每一步都是可追溯的，比如说原始页面有问题，我想能立刻查看下载下来的原始页面。因此在实际中，我没有使用管道把下载和解析串起来，下载是下载，解析是解析。

解析HTML我推荐nodeJS的cheerio，它可以像使用jQuery一样来定位元素，非常方便。解析器超出了本文的范畴，就不多提了，下面着重讲curl作为爬虫的用法。

    $ curl www.example.com/page_[1-100] -o "#1.html"

上面这条命令，方括号里是循环的数字，它会下载www.example.com/page_1~100的所有页面。

用-o指定保存的文件名，#1表示第一组循环的变量，它将把page_1保存成1.html，page_100保存成100.html。

除了数字循环，curl还支持枚举循环和多重循环，用法如下：

    $ curl www.example.com/{foo,bar}/page_[1-100] -o "#1_#2.html"

它会下载/foo/page_1~100，以及/bar/page_1~100。#1表示第一组循环变量，也就是foo和bar，#2表示第二组循环变量，也就是1到100，所以保存成的文件名就显而易见了。

执行一条curl命令进行批量下载，是会等前一个完成后再开始下一个下载。如果嫌不够快，可以执行多条curl命令来实现多进程并行下载。curl默认在前台执行，会阻塞用户的输入，如何执行多条curl命令呢？可以在命令后面加&，将它变为一个后台进程：

    $ curl www.example.com/page_[1-100] -o "#1.html" &

还需要注意，批量下载的进度信息会输出到stderr，也就是控制台，即使切成了后台进程，也依然会输出到控制台，扰乱你正常的操作。两个方法可以解决：

(1) 将stderr重定向到一个文件，这样就不会输出到控制台，而且在文件里保留了这些进度信息。

    $ curl www.example.com/page_[1-1] -o "#1.html" 2>>curl_progress.txt &

(2) curl命令的-s参数是silent的意思，即不输出进度信息到stderr:

    $ curl www.example.com/page_[1-1] -o "#1.html" -s &


##在云主机上跑爬虫

有些网站会封杀访问特别频繁的IP地址，这对网络爬虫来说很致命，一旦IP被封，就有一段时间无法抓取数据，时间的长短取决于对方的策略。

要是你有很多台电脑，就不怕封IP，这台不行那台上。在以往，这是难以实现的愿望，但如今拜云计算所赐，租用一台云主机的成本极低，每台云主机都有一个独立IP，并且还允许按小时租用。

不用我说也知道该怎么做了吧，租多台云主机，每台只租用一小时，抓一些数据后也差不多该被封了，立即导出数据，释放云主机。

市场上的云主机这么多，选用哪家的性价比高呢？阿里云和美团云是我重点比较的两家。

**阿里云价格配置**
![](/img/2014/web-crawler-in-a-hacking-way_aliyun-price.jpg)

**美团网价格配置**
![](/img/2014/web-crawler-in-a-hacking-way_meituan-price.jpg)

从配置上看，美团云的性价比显然高出阿里云好多。除此之外，美团云还有以下优势：

1. 支持的Linux版本多，而且很跟潮流，像ubuntu14已经在列了
2. 创建和销毁虚拟机的速度极快，更改带宽等配置实时生效无需重启
3. Web端的控制台支持向里面复制粘贴，而且不用每次都输入VNC密码

以上这些优势，有很多都是牺牲了安全性换来便捷性。在有些情况下，这正是我们要的，尤其对于朝生暮死的网络爬虫，谈安全简直是吃饱了撑的。

出于对大厂的迷信，我还是会把关键业务跑在阿里云上，无关紧要的脏活累活，就尽管交给高性价比的美团云。


## 附录：几个重要的curl命令参数

    --connect-timeout <seconds> 

Maximum time in seconds that you allow the connection to the server to take. This only limits the connection phase, once curl has connected this option is of no more use. Since 7.32.0, this option accepts decimal values, but the actual timeout will decrease in accuracy as the specified timeout increases in decimal precision. See also the -m, --max-time option.

If this option is used several times, the last one will be used.


    --create-dirs

When used in conjunction with the -o option, curl will create the necessary local directory hierarchy as needed. This option creates the dirs mentioned with the -o option, nothing else. If the -o file name uses no dir or if the dirs it mentions already exist, no dir will be created.

To create remote directories when using FTP or SFTP, try --ftp-create-dirs.


    -f, --fail

(HTTP) Fail silently (no output at all) on server errors. This is mostly done to better enable scripts etc to better deal with failed attempts. In normal cases when an HTTP server fails to deliver a document, it returns an HTML document stating so (which often also describes why and more). This flag will prevent curl from outputting that and return error 22.

This method is not fail-safe and there are occasions where non-successful response codes will slip through, especially when authentication is involved (response codes 401 and 407).


    --retry <num>

If a transient error is returned when curl tries to perform a transfer, it will retry this number of times before giving up. Setting the number to 0 makes curl do no retries (which is the default). Transient error means either: a timeout, an FTP 4xx response code or an HTTP 5xx response code.

When curl is about to retry a transfer, it will first wait one second and then for all forthcoming retries it will double the waiting time until it reaches 10 minutes which then will be the delay between the rest of the retries. By using --retry-delay you disable this exponential backoff algorithm. See also --retry-max-time to limit the total time allowed for retries. (Added in 7.12.3)

    -x, --proxy <[protocol://][user:password@]proxyhost[:port]>

Use the specified proxy.

    -K, --config <config file>

Specify which config file to read curl arguments from. The config file is a text file in which command line arguments can be written which then will be used as if they were written on the actual command line.

Options and their parameters must be specified on the same config file line, separated by whitespace, colon, or the equals sign. Long option names can optionally be given in the config file without the initial double dashes and if so, the colon or equals characters can be used as separators. If the option is specified with one or two dashes, there can be no colon or equals character between the option and its parameter.

If the parameter is to contain whitespace, the parameter must be enclosed within quotes. Within double quotes, the following escape sequences are available: \\, \", \t, \n, \r and \v. A backslash preceding any other letter is ignored. If the first column of a config line is a '#' character, the rest of the line will be treated as a comment. Only write one option per physical line in the config file.

Specify the filename to -K, --config as '-' to make curl read the file from stdin.

Note that to be able to specify a URL in the config file, you need to specify it using the --url option, and not by simply writing the URL on its own line. So, it could look similar to this:

    url = "http://curl.haxx.se/docs/"

When curl is invoked, it always (unless -q is used) checks for a default config file and uses it if found. The default config file is checked for in the following places in this order:

1) curl tries to find the "home dir": It first checks for the CURL_HOME and then the HOME environment variables. Failing that, it uses getpwuid() on UNIX-like systems (which returns the home dir given the current user in your system). On Windows, it then checks for the APPDATA variable, or as a last resort the '%USERPROFILE%\Application Data'.

2) On windows, if there is no _curlrc file in the home dir, it checks for one in the same dir the curl executable is placed. On UNIX-like systems, it will simply try to load .curlrc from the determined home dir.

    # --- Example file ---
    #this  is a comment
     url = "curl.haxx.se"
     output = "curlhere.html"
     user-agent = "superagent/1.0"
     
    
    # and fetch another URL too
     url = "curl.haxx.se/docs/manpage.html"
     -O
     referer = "http://nowhereatall.com/"
    #- -- End of example file ---
