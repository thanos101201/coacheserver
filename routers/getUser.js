const userModel = require("../models/user");

const getUser = (req, res) => {
    const email = req.body.email;
    userModel.find({
        email: email
    }).then((resp1) => {
        res.send(resp1);
    }).catch((er1) => {
        res.send(er1);
    });
}

module.exports = getUser;