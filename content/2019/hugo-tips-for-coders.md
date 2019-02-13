---
title: 写给程序员的 Hugo Tips
date: 2019-02-28
draft: true
layout: post
style: code
css: /css/1.css  /css/2.css
js: iframeResizer jquery
---

# 代码高亮

## Prism

# 自定义 front matter

## 

<iframe src="../iframe" frameborder="0" width="100%"></iframe>

```js 
function a() {
  let n = 0
  return function(){
    return n++
  }
}
```
<pre class="line-numbers"><code class="language-js"
>function a() {
  let n = 0
  return function(){
    return n++
  }
}
</code></pre>

<pre class="line-numbers" data-line="2-4, 5"><code class="language-js">
function a() {
  let n = 0
  return function(){
    return n++
  }
}
</code></pre>

```html
<section id="main">
  <div>
    <h1 id="title">{{ .Title }}</h1>
    {{ range .Data.Pages }}
      {{ .Render "summary"}}
    {{ end }}
  </div>
</section>
```

<script>iFrameResize()</script>