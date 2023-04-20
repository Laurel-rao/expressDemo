const {Sequelize} = require("sequelize")

// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: './database.db',
// });
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



module.exports = sequelize
