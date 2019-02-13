---
title: Express Initializer
date: 2017-03-21 07:00:00
layout: post
style: code
---

## Preface
A typical Express app has infrastructure dependencies, such as database, redis, etc. All these dependencies should be ready at the very beginning, so we get a checklist.

A good beginning is half the battle. In this article, we will focus on initialization steps.

## Globals? Yes!
Global variables are usually forbidden in code style guideline. The top one reason is global variables can be easily modified by mistake, and this mistake is hard to track.

Fortunately, we have `Object.defineProperty` in JavaScript. Using it, we can define a property on the `global` object, and not allow the property being modified.

```js
function addGlobalConst(name, value) {
  Object.defineProperty(global, name, {value: value})
}

addGlobalConst('addGlobalConst', addGlobalConst)
addGlobalConst('_', require('lodash'))
addGlobalConst('Promise', require('bluebird'))
addGlobalConst('fs', Promise.promisifyAll(require('fs')))
```

We define a function `addGlobalConst` to shorten the code. First, we add `addGlobalConst` itself to global object. After that we can use `addGlobalConst`  anywhere.

Lodash is my favorite utils module, I let it to occupy `_` symbol.

Bluebird is my favorite promise module, I’d like to give the name `Promise` to bluebird. After that, we can use [Promise.promisifyAll](http://bluebirdjs.com/docs/api/promise.promisifyall.html) to transfer all the APIs of fs module from callback nested style to promise chain style.

```js
addGlobalConst('Sequelize', require('sequelize'))
addGlobalConst('conf', require('config'))
addGlobalConst('axios', require('axios'))
addGlobalConst('backbone', new (require('events').EventEmitter)())
addGlobalConst('box', require('../box'))
```

We can add more references to global object, as listed above. `Sequelize` is for database. `conf` is for config file, we can access config items by `conf.item`. `axios` is a powerful HTTP client. These are modules from npm.

`backbone` is just an EventEmitter, we can use it handle event globally. Why use this name? Because I am familiar with this name. In 2013, [Backbone](https://github.com/jashkenas/backbone) was very famous in front-end world. Events are used heavily in backbone. If you want to subscribe an event, just write down:
```js
Backbone.on('eventName', function(data){
})
```
As the name, backbone is like the event bus of app. If you want to trigger a global event, just send it to event bus.

Every project has a utils file, which is tiny in the beginning, but soon grows into a huge pile of code. In my project, I use the name `box`, because it’s short and represents the right meaning.

When it’s hard to determine where to put a tool function, just put it into `box`. Keep the handy toolbox near you, if in need, just type `box.toolName`, I am sure you will love it.

## Database Ready
A big system may connect more than one databases. Each database goes with a connection block in the config file, and a Sequelize instance in source file.

In config file:
```js
db: {
  db1: {
    database: 'db1',
    user: 'user1',
    password: 'password1',
    options: {
      host: '127.0.0.1',
    }
  },
  db2: {
    database: 'db2',
    user: 'user2',
    password: 'password2',
    options: {
      host: '127.0.0.1',
    }
  },
}
```

In project root, we create a `db` directory, and for each database we create a sub-directory with the same name as the database.  For example, we have two databases, db1 and db2:

![](/img/2017/express-initializer_db.png)

We put all models of db2 into db2 directory, for example `Model` is one of the models of db2,  `Model.js` is like this:

```js
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Model',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      text: {
        type: DataTypes.STRING
      }
    },
    {
      debug: true
    })
}
```

Now, all the databases are located in db directory, all model files are located in their database sub-directory. It’s time to do some automations: import models into database(sequelize instance), and put the database under the global `db` object.

 `/db/index.js`

```js
const db = {}

function importModels(database, relativeDirPath) {
  db[relativeDirPath] = database

  let fullDirPath = `${__dirname}/${relativeDirPath}`

  fs.readdirSync(fullDirPath).filter(function (file) {
    return file.indexOf('.') !== 0
  }).forEach(function (file) {
    let model = database.import(`${fullDirPath}/${file}`)
    database[model.name] = model

    Object.keys(database).forEach(function (modelName) {
      if ('associate' in database[modelName]) {
        database[modelName].associate(database)
      }
    })
  })
}

fs.readdirSync(__dirname)
  .forEach(entry => {
    let dirPath = `${__dirname}/${entry}`
    let stat = fs.statSync(dirPath)
    if (stat.isDirectory() && entry.indexOf('.') !== 0) {
      let dbName = entry
      let dbConf = conf.db[dbName]
      let db = new Sequelize(dbConf.database, dbConf.user, dbConf.password, dbConf.options)
      importModels(db, dbName)
    }
  })

module.exports = db
```

The importing work are completely synchronous, so once you have required the module, you get all the models ready to use.

Sequelize has a `sync` function which can create tables according to our models automatically. It’s very convenient, especially in development environment.

 `/initializer/init-db.js`
```js
addGlobalConst('db', require('../db'))

module.exports = () => {
  return Promise.each(_.values(db), db => {
      return db.sync()
        .then(() => {
          console.log(`db sync success: ${db.config.database}`)
        })
        .catch(err => {
          console.error(`db sync fail: ${db.config.database};`, err)
          throw err
        })
    })
    .then(() => {
      console.log('init db success')
    })
}
```

## Redis Ready
If you don’t need redis at all, just skip this part.

Redis is  so important that we need make sure it’s ready to use at the beginning.

The redis npm package has two problems should be resolved. First, change the APIs from callback style to promise style. Second, handle the `error` event of redis client, otherwise it will terminate the process.

`/initializer/init-redis.js`
```js
addGlobalConst('redis', require('redis'))
Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

module.exports = (mandatory = false) => {
  const redisClient = redis.createClient(conf.redis)
  addGlobalConst('redisClient', redisClient)

  return new Promise((resolve, reject) => {
    function redisError(err) {
      console.trace('here')
      console.error('redis error', err)
    }

    function connectFail(err) {
      console.error('init redis fail', err)
      redisClient.on('error', redisError)
      if(mandatory){
        reject(err)
      }
      else{
        resolve()
      }
    }

    function connectSuccess() {
      console.log('init redis success')
      redisClient
        .removeListener('error', connectFail)
        .on('error', redisError)
      resolve()
    }

    redisClient
      .once('ready', connectSuccess)
      .once('error', connectFail)
  })
}
```
If you don’t wanna redis block the app starting, leave the `mandatory` argument with the default value `false` . If redis is critical for your app, specify this argument to `true`.

## The Initializer
Now it’s time to put all things together. We’d better leave only one entry to do all the initialization work. This entry’s code is as below:
`/initializer/index.js`
```js
function addGlobalConst(name, value) {
  Object.defineProperty(global, name, {value: value})
}

addGlobalConst('addGlobalConst', addGlobalConst)
addGlobalConst('_', require('lodash'))
addGlobalConst('Promise', require('bluebird'))
addGlobalConst('fs', Promise.promisifyAll(require('fs')))
addGlobalConst('Sequelize', require('sequelize'))
addGlobalConst('conf', require('config'))
addGlobalConst('axios', require('axios'))
addGlobalConst('backbone', new (require('events').EventEmitter)())
addGlobalConst('box', require('../box'))

const initDb = require('./init-db')
const initRedis = require('./init-redis')

exports.init = () => {
  return initDb()
    .then(() => {
      return initRedis()
    })
}
```

After finishing the entire initialization, then we start the HTTP server. If something goes wrong, we have to exit the process. So let’s make some changes to `/bin/www`:
```js
const initializer = require('../initializer')

initializer.init()
  .then(() => {
    console.log('init all success!')
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  })
  .catch(err => {
    console.error('init fail', err)
    process.exit(1)
  })
```

## Summary
The whole project [source code](https://github.com/mainTao/express-boilerplate-initializer) is on GitHub.
