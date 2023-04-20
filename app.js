// app.js

const express = require('express')
const {QueryTypes} = require("sequelize")
const app = express()
// 系统配置
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded
app.set("case sensitive routing", true)


// 初始化数据库连接

const {sequelize} = require('./models/db')
const {syncDB} = require('./models/scripts')
const {StudentRouter} = require('./controllers/student')

// 路由配置
app.get("/", (req, res) => {
    res.json("Hello World")
})
var adminRouter = express.Router()

adminRouter.get("/sync_db", (req, res) => {
    syncDB().then(r => console.log(r));
    res.send("OK");
})

var router = express.Router({caseSensitive: true, strict: true})

var router2 = express.Router();
router.get("/Foo", (req, res) => {
    res.json("Foo1")
})

router.get("/foo", (req, res) => {
    res.json("foo2")
})

router2.get("/run/one", async (req, res) => {
    try {
        const users = await sequelize.query("show tables", );
        console.log(users)

    } catch (error) {
        console.error('Unable to run select :', error);
    }
    // console.log(`\
    // req.fresh == ${req.fresh}
    // req.ip == ${req.ip}
    // req.originalUrl == ${req.originalUrl}
    // req.url == ${req.url}
    // req.params == ${req.params}
    // req.path == ${req.path}
    // req.query == ${req.query}
    // req.route == ${req.route}
    // req.hostname == ${req.hostname}`)
    res.send("run")
})

app.get("/Goo", (req, res) => {
    res.json("Goo")
})

app.post("/goo", (req, res) => {
    console.log(req.body)
    console.log(req.app)
    console.log(`req.baseUrl == ${req.baseUrl}`)
    res.json("goo")
})

const app2 = express();

app2.get("/", (req, res) => {
    res.send("This is sub-app server")
})
router.use("/router2", router2)
app.use('/', router);
app.use("/app2", app2)
app.use("/admin", adminRouter)
app.use("/student", StudentRouter)

module.exports = app;
