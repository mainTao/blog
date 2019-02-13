---
title: Express Middleware
date: 2017-04-14 07:00:00
layout: post
style: code
---

## What is middleware
In Express, a middleware is a function like this:
![](/img/2017/express-middleware_def.png)

Let’s read every word in the picture above, and see how it works.

HTTP method can be `get`, `post`, `put`, `delete` etc, and if we wanna apply the middleware in all methods, we should use `use` or `all`.

There is a tiny difference between `use` and `all`. When we use `use`, it matches all the requests whose path begins with the `path` parameter. When we use `all`, it only matches the requests whose path equals to the `path`, just like `get` behaves.

The `path` can be any of:
* A string representing a path.
* A path pattern, mixed with parameters.
* A regular expression pattern to match paths.
* An array of combinations of any of the above.

We use method and path as a filter to decide whether a middleware should be applied. If `path` parameter is missing, the middleware will be applied for all paths.

We use middleware to perform the following tasks:
* Execute any code, such as authorization, logging, sending response.
* Make changes to `req` and `res` objects.
* Control the request lifecycle by calling `next()` or not.

### What is req

The parameter [req](http://expressjs.com/en/api.html#req) inherits from [ClientRequest](https://nodejs.org/api/http.html#http_class_http_clientrequest), so we can use all features of ClientRequest.

From `req` we can read IP address, url, headers, cookies, parameters, etc.

When the request is coming, we can add some fields to the `req` object. For example, if the authentication is passed, we can let `req.user` be an object that contains the user’s information.


### What is res

The parameter [res](http://expressjs.com/en/api.html#res) inherits from [ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse), so we can use all features of ServerResponse.

We can set any part of an HTTP response, status code, headers, body, etc.

We use `res.json` to send a JSON response, `res.render` to send a web page, `res.redirect` to tell the client to go to a new address.


### What is next

Middleware are connected one by one to form a chain. When we call `next()`, it will pass the control from the current middleware to the next. But what is the next middleware exactly? Let’s see the code below.

```js
let middleware1 = function(req, res, next){
  next()
}
let middleware2 = function(req, res, next){
  next()
}
let middleware3 = function(req, res, next){}

app.use(middleware1, middleware2)
app.use(middleware3)
```

In middleware1, the next is middleware2. In middleware2, the next is middleware3. You may have noticed the order: left to right, then top to bottom, be careful about the filter conditions(method and path).

## Pitfall of next

There are exceptions those can break the middleware chain. First we need to know error-handling middleware. It looks like this:
```js
function (err, req, res, next){
}
```

It takes four arguments, the first is an Error object.  In practice, we usually put an error-handling middleware at the end of the chain, to catch all errors.

How to enter an error-handling middleware? When we pass anything into `next` function, it will skip all non-error-handling middleware, and jump into the subsequent first error-handling middleware.
```js
function (err, req, res, next){
  next(new Error('oops'))
}
function (err, req, res, next){
  next('oops') // equals to next(new Error('oops'))
}
function (err, req, res, next){
  next(123) // equals to next(new Error()), no error message
}
```

NOTICE! There is one exception: when the argument is a string whose content is `router`, it will not be regarded as an error. It has other meaning: skip all subsequent middleware in the current router, and pass the control back to its parent.

See the example:
```js
const router = express.Router()

let middleware1 = function(req, res, next){
  console.log(1)
  next('router') // go out of this router
}
let middleware2 = function(req, res, next){
  console.log(2) // will not execute
  next()
}
let middleware3 = function(req, res, next){
  console.log(3) // will not execute
  next()
}

router.use(middleware1, middleware2)
router.use(middleware3)
```

The special "router" string is an ugly design. I refuse to use this shit.

## Write middleware
One of the most exciting moment is to write your own middleware. Recently I have written three middleware and put them on GitHub:

* [express-response-cache](https://github.com/mainTao/express-response-cache)  can store HTTP response in memory, and use it as a cache.
* [express-request-rate-limit](https://github.com/mainTao/express-request-rate-limit) is a guard who will reject too many requests  from the same IP address.
* [express-params-checker](https://github.com/mainTao/express-params-checker) is a simple validator to check if any parameter is missing in the request.


### Configurable middleware
Middleware is more powerful if we can configure it. The way makes a middleware configurable is simple: export a function which accepts an options object or other parameters, the function returns the middleware implementation based on the input configurations.  Like this:

```js
module.exports = function(options) {
  return function(req, res, next) {
    // Implement the middleware function based on the options
    next()
  }
}
```

Take [express-params-checker](https://github.com/mainTao/express-params-checker) as example, we’ll see how to write a real configurable middleware, and how to use it.

The middleware code:
```js
const _ = require('lodash')

module.exports = (...requiredFields) => {
  const checkFunc = (req) => {
    let parameters = _.extend({}, req.query, req.body, req.params)
    for(let i = 0; i < requiredFields.length; i++){
      if(!_.has(parameters, requiredFields[i])){
        let err = new Error(`Missing parameter: ${requiredFields[i]}`)
        err.status = 400
        return err
      }
    }
    req.data = parameters
  }

  return (req, res, next) => {
    let err = checkFunc(req)
    next(err)
  }
}
```

Usage code:
```js
const paramChecker = require('express-params-checker')

router.post('/full-name',
  paramChecker('firstName', 'lastName'),
  function (req, res) {
    res.send(req.data.firstName + ' ' + req.data.lastName)
  }
)
```
