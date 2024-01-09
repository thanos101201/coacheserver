const axios = require('axios');
const userModel = require('../models/user');

const getUser = async (email) => {
    await userModel.find({
        email: email
    })
}

const udateData = async(req, res) => {
    const reftk = req.body.reftk;
    const loctk = req.body.loctk;

    const email = `${loctk}`;
    await getUser(email).then((resp1) => {

    }).catch((er1) => {
        res.status(400).send(er1);
    })

}

module.exports = udateData;