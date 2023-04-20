const app = require("./app")
const port = 8999;
const hostname = "127.0.0.1";
app.listen(port, hostname, () => {
    console.log(`server running on http://${hostname}:${port}`)
})

