---
title: EJS和underscore模板
date: 2014-06-21 07:40:02
layout: post
style: code
tags:
- underscore
- ejs
- template
---

NodeJS还没有流行起来之前，Ruby on Rails曾一度代表着互联网上最先进的生产力，好多后起之秀都受了它的影响。EJS和underscore作为新时代早期的开拓者，很自然地沿用了ERB的语法。但那毕竟是上个时代的遗产，和更先进的模板引擎Jade相比，显得落后不少。

互联网所有的人都在追新，我为什么还要写这样一个过时的技术？因为它虽然有些过时，但依然好用。为什么好用？因为简单。

其实做一个项目，能用到核武器的场景并不多，绝大部分情况下，几挺机枪就结束战斗了。

所以就算技术陈旧一点，也没什么大不了，反倒可能更快地解决战斗。Jade、Angular虽然很先进，不过大多数场景下EJS和Backbone也完全够用，而且更轻量级。

说归说，现实是搞技术的人太讨厌“陈旧”和“过时”了，有难以克服的追新强迫症。我决定狡猾地绕开这个问题，不说“过时”，而换成英语old-fashioned，感觉就另有一番味道了。

我们暂且把underscore和EJS的模板都统称为EJS like template。下面就来说一说这个old-fashioned模板技术。

## 概要

EJS like template的语法，两句话就能说明白：

> <% JS逻辑代码 %>
> <%= 要输出的内容 %>

详细用法下面有代码示例，先说一下基本原理。

> 模板 + 数据 ==> 结果字串

先要有模板，模板本质上是一个函数。把数据传入模板函数，就生成结果字串。

和正则表达式类似，模板也有一个所谓的编译过程，是需要耗费时间的。

如果你需要用同一个模板生成好多份数据，不妨先创建好这个模板，然后在需要生成结果字串时传入数据。这样只会有一次编译模板的过程，执行效率会高一些。

拿underscore的模板为例：

```js
// 下面这种写法会一步到位生成结果字串，但每一次调用都会创建一次模板
_.template('模板字串', {数据对象});  

// 分两步的用法
var compiled = _.template('模板字串'); // 创建模板
compiled({数据对象1}); // 填充数据
compiled({数据对象2}); // 重复利用之前编译好的模板
```

## underscore模板

[underscore](http://underscorejs.org)是我很喜欢的一个JS库，前后端都用得上。后起之秀[Lo-Dash](http://lodash.com/)要比underscore更强，但体积也更大，如果做后端开发，不介意脚本体积，Lo-Dash是非常不错的选择。

如果你的代码用不到[Lo-Dash有但underscore没有的特性](https://github.com/lodash/lodash#features-not-in-underscore)，或者十分在意脚本体积，用underscore更省心。

下面的代码是几个[underscore模板](http://underscorejs.org/#template)的例子：

``` html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <script src="js/underscore-min.js"></script>
</head>
<body>

<script>
    var list = ['foo', 'bar']; // 下面用来填充模板的数据
</script>


<!--
<% ... %> 用来包含要执行的JS代码，凡是不需要输出文本的地方都用它
<%= ... %> 用于输出文本，被包含的值解析后转换成文本
下面来看一个简单的循环，把list中每个元素打出来
为什么模板中可以直接用list的值？因为在执行模板填充时的上下文中可以找到list变量
-->
<script type="text/template" id="concat">
    <% for(var i = 0; i < list.length; i++){ %>
    <%= list[i] %>
    <% } %>
</script>
<script>
    var compiled = _.template(document.getElementById('concat').innerText); 
    console.log(compiled()); // 这个时候才会把值填进模板
</script>


<!--
习惯上，很少用上下文中的变量，而是显式传入数据对象
填充数据时，会从传入的对象中找到相应的key
例如模板中的list对应着数据对象中的list这个key的值
-->
<script>
    var data = {
        list: ['foo', 'bar']
    };
    compiled = _.template(document.getElementById('concat').innerText);
    console.log(compiled(data)); // 显式传入数据对象
</script>


<!--
<%= ... %> 的一种等价方式是print函数
在EJS里也存在print函数
有时候print比用<%= ... %>方便一点点，如下例
-->
<script type="text/template" id="print">
    <% for(var i = 0; i < list.length; i++){ print(list[i]); } %>
</script>
<script>
    compiled = _.template(document.getElementById('print').innerText);
    console.log(compiled(data));
</script>


<!--
上下文中的库和变量一样，都是可以在模板里使用的
下面模板中使用了underscore库的函数
-->
<script type="text/template" id="useLib">
    <% _.each(list, function(item){ %>
    <%= item %>
    <% }); %>
</script>
<script>
    compiled = _.template(document.getElementById('useLib').innerText);
    console.log(compiled(data));
</script>


<!--
<%= ... %>所包含的可以是表达式
经常用于做一些简单的格式处理
-->
<script type="text/template" id="eval">
    <% for(var i = 0; i < list.length; i++){ %>
    <%= "(" + (i + 1) + ")" + list[i].toUpperCase() %>
    <% } %>
</script>
<script>
    compiled = _.template(document.getElementById('eval').innerText);
    console.log(compiled(data));
</script>


<!--
模板最大的用处是输出HTML
为了可读性，一般将HTML标签直接写在模板里，不用包裹
只让动态的数据包含在<%= %>里，如下例
-->
<script type="text/template" id="html">
    <div class="list">
        <% for(var i = 0; i < list.length; i++){ %>
        <div class="item">
            <span class="num"><%= '(' + (i+1) + ')' %></span>
            <span class="text"><%= list[i].toUpperCase() %></span>
        </div>
        <% } %>
    </div>
</script>
<script>
    compiled = _.template(document.getElementById('html').innerText);
    var html = compiled(data);
    console.log(html);
    document.write(html); // 将生成的HTML写到页面
</script>


<!--
把一段文本原封不动地输出到页面上，就要进行必要的HTML转义
尤其文本是由用户输入的，很可能会包含HTML标签
<%- %>与<%= %>的不同之处是，<%- %>会把内容做HTML转义
-->
<script>
    var htmlList = ['<div>', '<ul> & <ol>'];
</script>
<script type="text/template" id="escape">
    <% for(var i = 0; i < htmlList.length; i++){ %>
    <%- htmlList[i] %>
    <% } %>
</script>
<script>
    compiled = _.template(document.getElementById('escape').innerText);
    var text = compiled(htmlList);
    console.log(text);
    document.write(text);
</script>

</body>
</html>
```

### 为什么模板中有空白和换行？

如果你观察了上面每段程序的console输出，会发现有大量换行和空格，这些换行和空格是哪里来的？答案是从模板里来。
在上面的例子中，我们像下面这样定义模板：

``` html
<script type="text/template">
    <% for(var i = 0; i < list.length; i++){ %>
    <%= list[i] %>
    <% } %>
</script>
```

取模板，用的是这个script标签的innerText，所有包含在script标签中的字符（包括换行和空格）都存在于模板中。
一般来说，不必介意这些换行和空白，因为最终要生成的HTML会忽略掉标签之间的空白，这是HTML的语法规则。

但如果真就不能忽略该怎么办呢？只好把空格都人为去掉，但这样会牺牲掉代码的可读性。例如：

``` html
<script type="text/template">
<% for(var i = 0; i < list.length; i++){ %><%= list[i] %><% } %>
</script>
```

使用print函数可以不必在<% %>和<%= %>间来回切换，令代码变简洁：

``` html
<script type="text/template">
<% for(var i = 0; i < list.length; i++){ print(list[i]} %>
</script>
```

注意，上面模板中，script的innerText的开头和结尾分别有一个换行，它们依然还在。要去掉它们，可以用trim()函数来将换行去掉。

### <%= %>和<%- %>中间两端的空格有效吗？

答案是无效。
<%= list[i] %> 和 <%=        list[i] %>的结果是一样的，最后都等价于<%=list[i]%>
这样一来，为了代码可读性，可以随意加空格。

### 在模板中包含JS逻辑合适吗？

我不推荐这样做，因为如果模板中的逻辑出了问题，往往很难排查。而且IDE的语法检查会忽略模板中的JS，有语法错误无法报告。

其实模板就应该保持它原本的用途，滥用反倒降低开发效率。

### 什么样的JS逻辑应该放在模板中？

我觉得任何需要多步运算的逻辑，都应该剔除出模板，甚至前面例子中的循环都不应该有。绘制列表，建议就给container和item各定义一个模板，没必要像上面例子中那样。

几个比较适合把逻辑放在模板中的场景：

**场景1：当某个变量存在的时候，输出这个变量，否则不输出:**
特别注意，如果模板中直接使用一个不存在的变量，会报异常。例如：
``` html
<% if(varName){     %>
<%=   xxx       %>
<% }            %>
```
如果varName不存在，则会抛异常说varName没有定义。为避免这种情况，可以把数据对象多嵌套一层。例如：
``` html
<% if(d.varName){     %>
<%=   xxx       %>
<% }            %>
```

送数据的时候只需要简单套一层：
> compiled({d: dataObj});

这样无论varName是否存在于d中，都不会抛出异常。


**场景2：根据不同的条件，输出不同的值:**
``` html
<% if(state === 'error'){ %>
<%=   error_msg           %>
<% else{                  %>
<%=   state               %>
<% }                      %>
```

**场景3：简单的格式转换，例如时间格式、数字格式、大小写等。**


## EJS

[EJS](https://github.com/visionmedia/ejs)也可以用在客户端，但通常都用于服务端NodeJS的模板引擎，例如Express，以及我博客用的hexo。

用Express创建一个使用EJS模板引擎的项目：

> express -e projectName

参数-e表示模板引擎用EJS。

语法没什么好说，和underscore的很像，唯一不同的是：
underscore的HTML转义是<%- %>，而EJS的HTML转义是用<%= %>，正好是颠倒的。这一点挺不爽，还好也不是大问题，因为一般用不到转义，用<%= %>就足够了。


