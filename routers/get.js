const userModel = require('../models/user');

const get = (req, res) => {
    userModel.find({
        email: req.headers.email
    }).then((resp1) => {
        res.status(200).send({
            'message': 'User data is here',
            'data': resp1
        })
    }).catch((er1) => {
        res.status(400).send(er1);
    })
}

module.exports = get;