---
title: Everything as a service
date: 2014-10-14 07:00:00
layout: post
style: code
---

最近用业余时间，开始着手做一个app，代号Rome。

为什么要有个代号，因为产品的最终形态现在还不能确定，正式的名字会是什么我也说不准。代号不那么正式，可以很随意。用一座城市的名字做产品代号，留给人很大的想象空间。每一座城市都有它的故事，例如罗马，你一定听说过它，并且想了解更多。于是会在产品诞生前，便对它有所期待。

叫Rome的另外一个原因，是我给自己打气。做这个app需要下很大功夫，无论手机客户端还是服务器端，设计开发所有大事小事都要我自己来。加上有了孩子以后可自由支配的时间更少，不知何日才能竣工。当遇到困难灰心丧气的时候，我可以鼓励自己说 Rome was not built in one day. 这便是Rome的由来。

兵法曰“未料胜，先料败”。这次如果失败了我完全可以坦然接受，因为我打算在这一路上逢山开路遇水搭桥，就算最后Rome没建成，开过的路搭起的桥可为后人所用，也值了。

果然刚起步就遇到一个障碍，要把一大堆地址归到它所在的省市。例如“青岛抚顺路蔬菜批发市场”，我希望不仅能从字面分析出它属于青岛市，还要能知道它归属于山东省，并且不能受抚顺两个字的干扰。

就这样一个功能，要做好其实是很复杂的。我一开始想着完全自己编程来解决，于是到网上找了个中国所有地区的表格，从省市到县区，巨细靡遗。通过查找地址中携带的省市等关键字，来匹配它的位置。写了一堆代码，虽然能work，但效果不够理想。比如“抚顺路蔬菜批发市场”，如果只匹配关键字，任你算法怎么牛逼，也不可能知道它其实是山东省青岛市的一个批发市场，和抚顺压根没有关系。

看来眼前的问题已经超出我的能力所及，我决定停止闭门造车，转而借互联网之力解决它。由于和地理位置有关，首先想到了百度地图。百度还是挺会讨好开发者的，对外提供了好些地图相关的API，免费用。站上巨人的肩膀，眼界一下开阔了。

百度地图的API里，有根据地址名查经纬度的，也有根据经纬度定位出具体在哪个省市区的。但偏偏没有一个API可以一步到位，直接查某个地址属于哪个省市。而且经过实验，我发现百度的这个API有时候会犯低级错误。例如它可以查得到XXX这个地址，但在前面加上省市限定，例如“山东省XXX”，竟然就找不到了！地址写得详细反而查不到，百度怎么搞的。

于是我决定把它改良一下，也作为公共的API开放出来。改良后有这么几个好处：

1. 免去注册百度开发者账号，申请key的麻烦
2. 一次API调用即可返回经纬度和省份等详情，无需接力
3. 绕过了百度API地址上带有省市反而找不到的问题

接口支持JSONP，允许在网页里跨域调用，下面是demo：

<input id="address" type="text" style="width:220px; display:inline-block"  placeholder="此处输入地址"/><button id="submit" style="margin-left:10px; width: 50px; display:inline-block">查询</button>

<pre id="output" style="background: lightgray;"></pre>


本文标题Everything as as service，这里的service指的比较具体，就是web service，即通常所说的web API。为什么要做成web service呢？事实上，亚马逊公司很久以前就在这么做了，亚马逊老大Jeff Bezos强令公司所有的接口都必须变成web service，包括公司内部使用的接口。这样一刀切的方式看似粗暴，但带来的好处多多，以至后来传为佳话。

统一成web service带来的最大好处就是通用，不管你用什么语言开发都可以拿来即用，否则要为每种语言做适配，还不累死。这一点其实与Unix的哲学不谋而合，Unix提倡Text is the universal interface，只有纯文本才是通用的接口形式，所以在Unix命令行的世界里，可以用管道这样优雅的方式进行数据传递。数据从管道的一端流入，经过处理，再从管道的另一端流出。流入流出的不是难懂的二进制格式，而是纯文本，随便找个记事本打开就能看结果。web service传承了这一优点，随便找个浏览器就能查看接口返回的结果。

如今的互联网，资源前所未有的丰富，人心前所未有的开放，想在互联网上贡献自己的一份力量，门槛也前所未有的低。只需要不足50块钱一个月，你便可以租一台云主机，拥有独立的IP，想干什么干什么。为其他开发者提供便利，web service是最直接的方式，拿来即用。如果你不介意，可以把源代码公开放在GitHub，让那些爱折腾的人基于你的成果进一步修改完善，胜造七级浮屠。

<hr>

[接口地址](https://api.maintao.com/china-area-query?q=青岛二中)

[Source code on GitHub](https://github.com/mainTao/ChinaAreaQuery)

<script src="/js/jquery.min.js"></script>
<script>
    $(function(){
        var query = function(){
            var q = $('#address').val();
            var url = 'https://api.maintao.com/china-area-query?q=' + q;
            console.log(url);
            $('#pre').text('');
            $.ajax({
                url: url,
                dataType: 'jsonp'
            }).done(function(data) {
                console.log(data);
                var text = JSON.stringify(data, undefined, 4);
                console.log(text);
                $('#output').text(text);
            }).fail(function(error){
                console.error(error);
                $('#output').text('查询失败');
            });
        };

        $(document).on('click', '#submit', query);

        $(document).on('keypress', '#address', function(e){
            if(e.keyCode == '13'){
                query();
            }
        });
    });
</script>

