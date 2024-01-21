const userModel = require("../models/user");
const axios = require('axios');
const getUserDetail = async (config) => {
    return await axios.get('https://openidconnect.googleapis.com/v1/userinfo', config)
}

const getCal = async(req, res) => {
    // const email = req.headers.email;
    const exercise = req.headers.exercise;
    const acctk = req.headers.acctk;
    const config = {
        headers: {
            'Authorization': 'Bearer ' + acctk
        }
    };
    console.log(`acctoken : ${acctk}`);
    await getUserDetail(config).then((resp101) => {
        // console.log(resp101.data.email);
        userModel.find({
            email: resp101.data.email
        }).then((resp1) => {
            if(resp1.length === 0){
                res.status(404).send({
                    'message' : 'User not found'
                });
            }
            else{
                if(resp1[0].calorieBurnt !== undefined && resp1[0].calorieBurnt.length > 0){
                    let cal = resp1[0].calorieBurnt.filter((e) => {
                        if(e.exercise === exercise){
                            return true;
                        }
                        return false;
                    });
                    let calorie = [];
                    cal.map((e) => {
                        calorie.push(e.calories);
                    })
                    res.status(200).send({
                        'message': 'The calorie data is here',
                        'data' : calorie
                    });
                }
                else{
                    res.status(204).send();
                }
            }
        }).catch((er1) => {
            res.status(400).send(er1);
        })
    }).catch((er101) => {
        // console.log(er101.message);
        if(er101.response.data.error.code === 401 && er101.response.data.error.errors[0].message === 'Invalid Credentials' && er101.response.data.error.errors[0].location ==='Authorization'){
            res.status(400).send({
                'message': 'Please sign in again'
            });
        }
        else{
            res.status(401).send(er101);
        }
    })


}

module.exports = getCal;