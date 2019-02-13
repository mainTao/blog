---
title: Express Good Packages
date: 2017-03-07 07:00:00
layout: post
style: code
---

## Preface
As a Node.js lover, I have a habit of searching packages on [npm](https://www.npmjs.com/).

Some packages are really awesome, even better than Express. I am very glad to introduce these packages to you.


## axios
[axios](https://www.npmjs.com/package/axios) is a promise based HTTP client for the browser and Node.js.

It’s the most powerful HTTP client I ever seen. Powerful usually comes with hard to use together, but axios is an exception. It’s a convenient tool for both client and server side.
```
	npm i axios -S
```

## bluebird
We use promise to get out of callback hell. From many promise libraries,
I choose [bluebird](https://www.npmjs.com/package/bluebird) and put it into my toolbox.

Bluebird not only has powerful features like map/reduce, but also has exceptionally good performance.
```
	npm i bluebird -S
```

## config
Different environments have different configurations. For example, when you write code on your MacBook, the program connect to a database in development environment, and when deploy your code in production environment, it connect to the production database with different credentials.

Sometimes we need to secure production config files, and sometimes we want different node instances have different config files.

The tasks above are very challenging. Fortunately, with the help of [config](https://www.npmjs.com/package/config), they become easy to us.

```
	npm i config -S
```


## cors
[CORS](https://www.npmjs.com/package/cors) is an Express middleware that can be used to enable CORS(Cross Origin Resource Sharing) with various options.

```
	npm i cors -S
```

## lodash
On GitHub, [lodash](https://www.npmjs.com/search?q=lodash) has more than 20K stars.

If I were stranded on a desert island and could only take one Node.js package with me, it would be lodash.

```
	npm i lodash -S
```

## multer
[Multer](https://www.npmjs.com/package/multer) is a Node.js middleware for handling multipart/form-data, which is primarily used for uploading files.

```
	npm i multer -S
```

## redis
If I were stranded on a desert island and could only take one storage with me, it would be [redis](https://www.npmjs.com/package/redis) .

All the methods on this package is callback style, but we can promisify them with bluebird’s [promisifyAll](http://bluebirdjs.com/docs/api/promise.promisifyall.html)  method.

```
	npm i redis -S
```

## sequelize
[Sequelize](https://www.npmjs.com/package/sequelize)  is a promise-based ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server.

The dialects list which sequelize supports is long, but Oracle is not on the list. This will not affect me, because I hate Oracle, like most developers do.

```
	npm i sequelize -S
```
## vhost
If one Express instance needs to handle requests to more than one host, [vhost](https://www.npmjs.com/package/vhost) can be helpful.

```
	npm i vhost -S
```

