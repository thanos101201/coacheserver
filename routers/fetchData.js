const axios = require('axios');
const userModel = require('../models/user');
const obtainCalId  = (resp3) => {
    let cal_id = "";
    if(resp3.data.dataSource !== undefined && resp3.data.dataSource.length > 0){
        resp3.data.dataSource.map((e1,k1) => {
            if(e1.dataStreamName === "merge_calories_expended"){
                cal_id = e1.dataStreamId;
            }
        });
    }
    //returning the calorie id
    return cal_id;
}

const getUser = async (email) => {
    await userModel.find({
        email: email
    })
}

const getCalorieData = async (config, calId, startTime) => {
    const startDate1 = startTime;
    startDate1.setDate(1);
    // startDate1.setMonth(startDate1.getMonth() -1); // Subtract one month from current date
    const startTimeMillis = startDate1.getTime(); // Get start time in milliseconds
    const endTimeMillis = Date.now();
    return await axios.post("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
        aggregateBy: [
            {
                dataTypeName: 'com.google.calories.expended', //'merge_calories_expended',// 'com.google.heart_minutes',
                dataSourceId: calId //'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended' //'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended'// resp1[0].streamId // 'derived:com.google.heart_minutes:com.google.android.gms:merge_heart_minutes',
            },
        ],
        bucketByTime: {
        durationMillis: 86400000, // 24 hours in milliseconds
        },
        startTimeMillis: startTimeMillis, // Replace with your desired start time
        endTimeMillis: endTimeMillis, // Replace with your desired end time
    }, config)
}

const getUserDetail = async (config) => {
    return await axios.get('https://openidconnect.googleapis.com/v1/userinfo', config)
}

const fetchStreamIdStore = async (config) => {
    return await axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources',config)
}

const calculateCalorie = (resp5) => {
    let cals = 0;
    if(resp5.data.bucket.length > 0){
        resp5.data.bucket.map((e2,k2) => {
            if(e2.dataset.length > 0){
                e2.dataset.map((e3, k3) => {
                    if(e3.point.length > 0){
                        e3.point.map((e4, k4) => {
                            cals = cals + e4.value[0].fpVal;
                        });
                    }
                })
            }
        });
    }
    return cals;
}

const addUser = async (email, name, acctk, reftk, calorie) => {
    let userm = new userModel();
    userm.email = email;
    userm.name = name;
    userm.acctk = acctk;
    userm.reftk = reftk;
    userm.lastupdt = Date.now();
    await userm.save()
}

const fetchData = async (req, res) => {
    const acctk = req.body.acctk;
    const reftk = req.body.reftk;
    const checkFetch = req.body.checkFetch;
    const exercise = req.body.exercise;
    const config = {
        headers: {
            'Authorization': 'Bearer ' + acctk
        }
    };

    await getUserDetail(config).then(async(resp1) => {
        if(resp1.status === 200){
            let email = resp1.data.email;
            let name = resp1.data.name;

            await getUser(email).then(async (resp2) => {
                if(resp2.length === 0){
                    fetchStreamIdStore(config).then(async (resp3) => {
                        let calId = obtainCalId(resp3);
                        if(calId === ""){
                            res.status(400).send({
                                'message': 'Please install application'
                            })
                        }
                        else{
                            await addUser(email, name, acctk,reftk, []).then((resp5) => {
                                res.status(200).send({
                                    'message' : 'User added',
                                    'email': email,
                                    'name': name
                                });
                            }).catch((er5) => {
                                res.status(400).send(er5);
                            });
                        }
                    }).catch((er3) => {
                        res.status(403).send(er3);
                    })
                }
                else{
                    if(checkFetch){
                        await userModel.updateOne({
                            email: email
                        }, {
                            lastupdt : Date.now()
                        }).then((resp6) => {
                            res.status(200).send({
                                'message': 'User checked in'
                            })
                        }).catch((er6) => {
                            res.status(400).send(er6);
                        });
                    }
                    else{
                        await getCalorieData(config, resp1[0].email, resp1[0].lastupdt).then((resp2)=>{
                            let calorie = calculateCalorie(resp2);
                            if(resp1[0].todayDt === `${new Date().getDate()} / ${new Date().getMonth()} / ${new Date().getFullYear()}`){
                                let calo = resp1[0].calorieBurnt[resp1[0].calorieBurnt.length - 1];
                                calo.push({
                                    'exercise' : exercise,
                                    'calories': calorie
                                });
                                userModel.updateOne({
                                    email: email
                                }, {
                                    calorieBurnt : resp1[0].calorieBurnt.push(calo)
                                }).then((resp2) => {
                                    res.status(200).send({
                                        'message': 'User data updated'
                                    });
                                }).catch((er2) => {
                                    res.status(403).send(er2);
                                });
                            }
                            else{
                                let ar = [{
                                    'exercise' : exercise,
                                    'calories': calorie
                                }];
                                userModel.updateOne({
                                    email: email
                                }, {
                                    todayDt: `${new Date().getDate()} / ${new Date().getMonth()} / ${new Date().getFullYear()}`,
                                    calorieBurnt : resp1[0].calorieBurnt.push(ar)
                                }).then((resp2) => {
                                    res.status(200).send({
                                        'message': 'User updated'
                                    });
                                }).catch((er2) => {
                                    res.status(400).send(er2);
                                })
                            }
                        })
                    }
                }
            }).catch((er2) => {
                res.status(403).send(er2);
            })
        }
    })

}

module.exports = fetchData;