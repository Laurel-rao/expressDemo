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
