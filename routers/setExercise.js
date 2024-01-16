const userModel = require("../models/user");

const setExercise = (req, res) => {
    const exercise = req.body.exercise;
    const email = req.body.email;

    userModel.updateOne({
        email: email
    }, {
        exercise: exercise
    }).then((resp1) => {
        res.status(200).send({
            'message': 'Exercise started'
        });
    }).catch((er1) => {
        res.status(400).send(er1);
    })
}