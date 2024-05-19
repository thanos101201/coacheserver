const userModel = require("../models/user");
require('dotenv').config();

const setExercise = (req, res) => {
    const exercise = req.body.exercise;
    const email = req.body.email;
    console.log(`exercise : ${exercise} , email : ${email}`);
    userModel.updateOne({
        email: email
    }, {
        exercise: exercise,
        lastupdt:  Date.now()
    }).then((resp1) => {
        res.status(200).send({
            'message': 'Exercise started'
        });
    }).catch((er1) => {
        res.status(400).send(er1);
    })
}

module.exports = setExercise;