---
title: Express sub-app
date: 2017-02-28 07:00:00
layout: post
style: code
---

## Preface
Express is an old-fashioned but the most popular web framework in Node.js.

It is widely used because of its simplicity and steadiness, and it allows you to grow your system as needed.

Every time I build a new Express project, I need to do some boilerplate work, create directories and files, install my favorite packages, copy and paste code snippets…

I don’t wanna waste time on these repeating boilerplate work. So I have a plan to write a series of articles about building an Express project from scratch to a flexible architecture.

In this article, I will introduce sub-app in Express.

## Forget express-generator
[Express application generator](http://expressjs.com/en/starter/generator.html) is from Express official website. It helps you generating the project structure. But I think it’s only for starters. When your system grows a little larger, the initial structure will become a drawback.

## Forget micro-service
Micro-service is good, but brings extra work. In this series, I don’t aim to build a micro-service system, but an all-in-one system.

What does an all-in-one system include? Today, It usually includes three parts:

1. API service for web or native clients
2. Host web pages for users (mobile first)
3. Control panel for administrator (desktop first)

## Why sub-app
Sub-app provides flexibility. We can divide different business into different sub-apps. Different business are isolated in their own apps, rather than twisted together.

You can specify each app’s [settings](http://expressjs.com/en/4x/api.html#app.settings.table) , choose different view engine and stylesheet middleware.

API service and admin service usually have different ways to authenticate, different app settings, different log files, different error handlers. So they need different middleware. After separating into sub-apps, you can use app-wide middleware with less concern.

Meanwhile, sub-apps have a lot of things to share, such as node_modules, config files, database models, and utilities.

Sharing is so important because it can reduce a lot of dirty work and make developers happy.

How to balance between isolation and sharing? Sub-app is the gold key!

## Mount sub-app
After introducing sub-app, we can mount  sub-apps onto the main-app, and keep the main-app incredibly clean.

The main-app code is as below:

```js
const express = require('express')
const vhost = require('vhost')
Object.defineProperty(global, '_', {value: require('lodash')}) // import lodash globally

// main-app
const app = express()

// sub-app
const api = require('./api/app')
const admin = require('./admin/app')
const h5 = require('./h5/app')

app.use(vhost('admin.example.com', admin))

app.use(vhost('api.example.com', api))

app.use(vhost('www.example.com', h5))
app.use(vhost('example.com', h5))

app.use(function (req, res) {
  console.error('404 in main app')
  res.status(404).send('Not Found')
})

module.exports = app
```

## vhost middleware
[vhost](https://github.com/expressjs/vhost) is a very useful middleware from Express official.

In the code above,  `admin` and `api` are mounted by single vhost routing rule, `h5` is mounted by two vhost routing rules.

When the hostname of a request matches `api.example.com`, it will be handled by the `api` sub-app.

## Example code
![](/img/2017/express-sub-app_project-structure.png)

This is the project structure. `api`, `admin` and `h5` sub-apps are in their own directory. Take `api` as example, we don’t need a view engine or stylesheet middleware. JSON is the only format the response should be in.

`/api/app.js`:

```js
const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const routes = require('./routes')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err) // will skip any non-error-handler middleware
})

// error-handler-middleware has err as the first parameter
app.use(function(err, req, res, next) {
  let json = {} // ensure response in JSON format

  if(_.isError(err)){
    if(req.app.get('env') === 'development'){
      json.stack = err.stack // add stack in development environment
    }
    json.message = err.message
  }
  else if(_.isString(err)){
    json.message = err // string as the error message
  }
  else if(_.isPlainObject(err)){
    json = err // JSON object as response
  }

  res.status(err.status || 500).json(json)
})

module.exports = app
```

The whole project code is on [GitHub](https://github.com/mainTao/express-boilerplate-subapp).
