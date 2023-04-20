const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("./db")

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
// `sequelize.define` 会返回模型
// console.log(User === sequelize.models.User); // true
module.exports = {Student, Score}
