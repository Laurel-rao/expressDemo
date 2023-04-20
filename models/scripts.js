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
