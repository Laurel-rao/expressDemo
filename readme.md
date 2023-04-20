@[toc]
# express 介绍
- express 是 nodejs 的一个web开发框架，支持 mvc 模式，路由，数据库连接，网页渲染，过程处理集一身的框架
- [官方网站](http://expressjs.com/en/4x/api.html)
## 快速入门
- 安装环境
	1. nodejs
	2. npm install -D express
- Hello world程序
```
// app.js
const express = require('express')
const app = express()

app.get("/", (req, res) => {
	res.json("Hello World")
})

const port = 8999;
app.listen(port, () => {
	console.log(`server running on http://localhost:${port}`)
})
```

## 常用组件
- 开发推荐
```
// 使用nodemon 启动，可以更改后自动更新，不用重启
npm install -g nodemon
// 在 package.json 中, 添加 scripts
{
  "devDependencies": {
    "express": "^4.18.2"
  },
  "scripts": {
    "dev": "nodemon runserver.js"
  }
}
// 启动服务
npm run dev
```
- 开启 json 解析，否则 req.body 为空
```
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
```
## 1. 项目设置

- Router
```js
// 1. 路由限制大小写 caseSensitive 默认 false
var router = express.Router({caseSensitive:  true})
// 2. 最后斜杠严格限制 strict 默认 false
var router = express.Router({strict: true})
```
```js
router.get("/Foo", (req, res) => {
    res.json("Foo1")
})

router.get("/foo", (req, res) => {
    res.json("foo2")
})

app.use('/', router);
```
- 结果如下
```cmd
C:\Users\Rao>curl 127.0.0.1:8999/foo/
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /foo/</pre>
</body>
</html>

C:\Users\Rao>curl 127.0.0.1:8999/foo
"foo2"
C:\Users\Rao>curl 127.0.0.1:8999/Foo
"Foo1"
C:\Users\Rao>
```
- 另外，参数默认普遍有 100kb 的大小限制，具体可根据 [官网express](http://expressjs.com/en/4x/api.html#express)进行修改

- 端口和监听地址
```
app.listen(3999)
app.listen(3999, "127.0.0.1")
app.listen(3999, "0.0.0.0")
// 设置服务启动后，打印信息
const port = 8999;
const hostname = "localhost";
app.listen(port, "0.0.0.0", () => {
    console.log(`server running on http://${hostname}:${port}`)
})
```
- 全局设置
```
// 设置限制大小写，false 为 忽略大小写
app.set("case sensitive routing", true)
app.get("/Goo", (req, res) => {
    res.json("Goo")
})

app.get("/goo", (req, res) => {
    res.json("goo")
})
```
属性|类型|说明|默认值
--|--|--|--
case sensitive routing|Boolean|开启限制大小写关闭忽略大小写|false
env|String|环境变量|默认为系统变量 NODE_ENV
etag|Varied|SEO优化项目，URLTag，可选 true，false, weak, strong|weak
jsonp callback name|String	|jsonp回调名|	“callback” 
json escape|Boolean|json转义，防止xss攻击|N/A (undefined)
json replacer|Varied|添加空格和回车，美化json数据展示, stringify 参数 replacer|N/A (undefined)
json spaces|Varied|添加空格和回车，美化json数据展示, stringify 参数 spaces|N/A (undefined)
query parser|Varied	|自定义query请求解析|"extended"
strict routing|Boolean|设置为true， /foo 和 /foo/ 将是两个不同的请求 |N/A (undefined)
subdomain offset|Number|使用域名时，子域名与父域名之间不能超过2个`.`|2
trust proxy|Varied|代理设置，详情请看[官网](http://expressjs.com/en/4x/api.html#trust.proxy.options.table)|false (disabled)
views|String or Array|服务默认查找的html模板目录，如果是数组，将按照顺序查找|process.cwd() + '/views'
view cache|Boolean|开启html静态文件缓存|true in production, otherwise undefined.
view engine|String|view 渲染引擎，可选 html， jade， 需要安装[额外插件](http://expressjs.com/en/4x/api.html#app.engine) |N/A (undefined)
x-powered-by|Boolean|开启后将在头部添加 "X-Powered-By: Express"|true

- mountpath 挂载路径 (实现子组件添加到项目中)
```js
var admin = express()

admin.get('/', function (req, res) {
  // 显示目录的父目录挂载目录，感觉没啥用
  console.dir(admin.mountpath) // [ '/adm*n', '/manager' ]
  res.send('Admin Homepage')
})

var secret = express()
secret.get('/', function (req, res) {
  console.log(secret.mountpath) // /secr*t
  res.send('Admin Secret')
})

admin.use('/secr*t', secret) // load the 'secret' router on '/secr*t', on the 'admin' sub app
app.use(['/adm*n', '/manager'], admin) // load the 'admin' router on '/adm*n' and '/manager', on the parent app
```
## 2. 路由组件

- 路由分层
1. app 路由
2. 子组件 路由
3. route组件路由

- 1. app 路由，直接使用 `app.get app.post `等
```js
app.get("/Goo", (req, res) => {
    res.json("Goo")
})
```
- 2. 子组件路由，使用 另一个 express 服务，挂在在路由上
```js
// 请注意，该方式下，有些全局参数不能生效，具体查看[官网](http://expressjs.com/en/4x/api.html#app.set)
const app = express()

const app2 = express();

app2.get("/", (req, res) => {
    res.send("This is sub-app server")
})

app.use("/app2", app2)
```
3. 使用router 挂载在 app 上，该方式可以嵌套
```js
var router = express.Router({caseSensitive: true, strict: true})

var router2 = express.Router();
router.get("/Foo", (req, res) => {
    res.json("Foo1")
})

router2.get("/run", (req, res) => {
    res.send("run")
})

router.use("/router2", router2)
app.use('/', router);
// 访问 http://localhost:8999/router2/run
```
## 3. req 对象
- request 对象，包含请求头，cookies ，请求体，等http 信息， 具体请参看下表

对象|返回值|说明
--|--|--
req.app|整体服务的一些变量|具体打印查看
req.baseUrl|上一层路由地址|
req.body|form-data 或者 json 格式内容|
req.cookies|cookies|
req.fresh|缓存是否打开|
req.hostname|hostname，在app设置的那个变量|
req.ip|服务器ip|
req.ips|代理开启时，代理地址数组|
req.method|请求方法|
req.originalUrl|和url差别，显示完整url，包括父组件或者父路由|
req.params|路由请求参数|不是?userid=1 而是 /users/1/ 这里的参数
req.path|url包含query参数，path不包括|
req.protocol|http or https|
req.query|?user=1 请求参数|
req.res|response对象|
req.route|Route对象|
req.secure|https 与否|
req.signedCookies|登录用户组件|
req.stale|req.refresh反义词|
req.subdomains|域名解析的子域名数组|
req.xhr|xhr 请求支持|
Methods||
req.accepts()|判断请求头|
req.acceptsCharsets()|判断请求头|
req.acceptsEncodings()|判断请求头|
req.acceptsLanguages()|判断请求头|
req.get()|获取请求头数据|
req.is()|判断请求头|
req.param()|万能获取参数方式|
req.range()|限制请求头大小解析|
## 4. res 对象
- [官网链接](http://expressjs.com/en/4x/api.html#res)
- 只选重要的写
- 返回方式
	1. json
	2. text
	3. 文件
	4. 网页渲染
- 额外信息附加
	- 更改请求头(包含cookies)
	- 更改状态码
	
### 1. json 格式
1. `res.json({"name": "1"})`

### 2. text 格式
1. `res.send("content")`

### 3. 文件 (传入文件名)
1. res.download()
2. res.attachment()
3. res.sendFile()

### 4. 网页渲染
```
res.render('index', function (err, html) {
  res.send(html)
})
```

### 5. 添加请求头，添加cookies
```
res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>'])
res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly')
res.append('Warning', '199 Miscellaneous warning')
```

- cookies
```
res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true })
res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })
```
### 6. 修改状态码
```
res.status(403).end()
res.status(400).send('Bad Request')
```

## 5. 中间层 middleware（待写。。。）
- 待写。。。。
1. 用户登录
2. 权限管理
3. 日志记录

## 6. 数据库操作
- [sequelize 官网](https://www.sequelize.cn/core-concepts/getting-started)
### 1. mysql连接
- 支持多种关系型数据库(sqlite3,mysql,postgresql,SQLServer,DB2)
- 本次演示以 sqllite3 为例，该数据库为文件数据库，不需要预先安装数据库
1. 安装npm依赖
	- npm i sequelize
	- npm i sqlite3
### 2. 创建数据库连接
```
const sequelize = new Sequelize('test', '', '',{
    dialect: 'mysql',
    hostname: '127.0.0.1',
    port: 3306,
    database: "test"
});

try {
    sequelize.authenticate().then(r => {
        console.log('Connection has been established successfully.');
    }).catch (err => {
        console.error('Unable to connect to the database:', err);
    });
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

```

### 3. mysql 定义对象 ORM

```
const Student = sequelize.define('User', {
    // 在这里定义模型属性
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "zhangsan",
    },
    gender: {
        type: DataTypes.STRING
        // allowNull 默认为 true
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
}, {
    // 这是其他模型参数
});

const Score = sequelize.define('Score', {
    // 在这里定义模型属性
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    student: {
        type: DataTypes.INTEGER,
        // allowNull 默认为 true
        references: {
            model: Student,
            key: 'id',
        }
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
}, {
    // 这是其他模型参数
});
Student.hasMany(Score, {
    foreignKey: 'student'
});
```
	
### 4. mysql 操作

### 1. sql 操作
		- `sequelize.query("sql_str")`
### 2. ORM 操作
1. 同步模型到数据库
	
```
// sequelize.sync 函数执行
const sequelize = require("./db");
const {Student, Score} = require("./student")

async function syncDB() {
    await sequelize.drop();
    sequelize.sync({ force: true }).then( (r) => {
        console.log("同步完成")
        Student.create({"firstName": "123", "gender": "male"})
    }).catch(error => {
        console.error("同步失败 ", error)
    })
    console.log(await sequelize.query("show tables;"))
    // CREATE TABLE IF NOT EXISTS `Users` (`firstName` VARCHAR(255) NOT NULL DEFAULT 'zhangsan', `
    // gender` VARCHAR(255), `id` INTEGER PRIMARY KEY AUTOINCREMENT, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIM
    // E NOT NULL);
}

module.exports = {syncDB}

```
2. 写入，查询
```
const express = require("express");
const {Score} = require("../models/student");
const {Student} = require("../models/student");

const StudentRouter = express.Router();


StudentRouter.get("/", async (req, res) => {
    const student = await Student.create({"firstName": "1111", "gender": "None"})
    const score = await Score.bulkCreate([{"score": 100, "name": "math"}, {"score": 90, "name": "language"}, {"score":  59, "name": "physics"}])
    await student.addScore(score);
    res.send("student add success")
})


StudentRouter.get("/show", async (req, res) => {
    let studentData = await Student.findByPk(2, {include: [Score]});
    res.json(studentData)
})

module.exports = {StudentRouter}

```
## 7. restful API设计 （待写。。。。）
- 待写。。。。
# 从一个学生管理系统开始 （待写。。。。）
- 学习目标
```
- 掌握数据库概念化定义ORM 
- 掌握复杂路由设置
- 掌握常用插件使用
```

## 1. 学生管理系统设计
- 学生信息展示
- 学生登录
- 学生考试成绩

## 2. 数据库定义
- 学生表


# 参考

1. 数据库处理
	- https://www.bookstack.cn/read/sequelize-5.x-zh/spilt.2.getting-started.md
	- https://www.cnblogs.com/alexander3714/p/14158395.html
