const userModel = require('../models/user');

const getUserDetail = async (config) => {
    return await axios.get('https://openidconnect.googleapis.com/v1/userinfo', config)
}

const get = async(req, res) => {
    const acctk = req.headers.acctk;
    const config = {
        headers: {
            'Authorization': 'Bearer ' + acctk
        }
    };
    await getUserDetail(config).then((resp101) => {
        if(resp101.status === 200){
            userModel.find({
                email: resp101.data.email
            }).then((resp1) => {
                res.status(200).send({
                    'message': 'User data is here',
                    'data': resp1
                })
            }).catch((er1) => {
                res.status(400).send(er1);
            })
        }
        else{

        }
    }).catch((er101) => {
        res.status(400).send(er101);
    });
}

module.exports = get;