const axios = require('axios');
const userModel = require('../models/user');

const { google } = require('googleapis');

const getEmail = async (authClient) => {
    const people = google.people({//creating people's client for fetching email data
        version: 'v1',
        auth: authClient
    });
    // console.log(people);
    //returning the email address using people's client
    return await people.people.get({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses'
    });
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

const getUser = async (email) => {
    await userModel.find({
        email: email
    })
}


const udateData = async(req, res) => {
    try{
        const reftk = req.headers.reftk;
        const acctk = req.headers.acctk;
        const exercise = req.headers.exercise;

        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            "http://localhost:3000/sign",
            true
        );
        oauth2Client.setCredentials({
            access_token: acctk,
        });
        const peopleAPI = getEmail(oauth2Client)

        peopleAPI.then(async (resp101) => {
            let email = resp101.data.emailAddresses;
            await getUser(email).then(async (resp1) => {
                if(resp1.length === 0){
                    res.status(200).send({
                        'message': 'User not registered'
                    });
                }
                else{
                    let streadId = resp1[0].calId;
                    await getCalorieData(streadId).then(async (resp2) => {
                        let calorie = calculateCalorie(resp2);
                        let calories = resp1[0].calorieBurnt[resp1[0].calorieBurnt.length - 1];
                        calories.push({
                            'exercise' : exercise,
                            'calories': calorie
                        });
                        let cal = resp1[0].calorieBurnt
                        cal[cal.length - 1] = calories;
                        await userModel.updateOne({
                            email: email
                        }, {
                            calorieBurnt: cal
                        }).then((resp3) => {
                            res.status(200).send({
                                'message': 'Data updated'
                            })
                        }).catch((er3) => {
                            res.status(400).send(er3);
                        })

                    }).catch((er2) => {
                        res.status(400).send(er2);
                    })
                }
            }).catch((er1) => {
                res.status(400).send(er1);
            })
        }).catch(async (er101) => {
            if(er101.response.data.error.code === 401 && er101.response.data.error.errors[0].message === 'Invalid Credentials' && er101.response.data.error.errors[0].location ==='Authorization'){
                oauth2Client.setCredentials({
                    refresh_token: reftk
                });
                const tokens  = await oauth2Client.refreshAccessToken();
                const acctk = tokens.credentials.access_token;
                const reftk = tokens.credentials.refresh_token;
                oauth2Client.setCredentials({
                    access_token: tokens.credentials.access_token,
                });

                let peopleApi = getEmail(oauth2Client)

                peopleAPI.then( async (resp303) => {

                    let email = resp303.data.emailAddresses;
                    await getUser(email).then(async (resp1) => {
                        if(resp1.length === 0){
                            res.status(200).send({
                                'message': 'User not registered'
                            });
                        }
                        else{
                            let streadId = resp1[0].calId;
                            await getCalorieData(streadId).then(async (resp2) => {
                                let calorie = calculateCalorie(resp2);
                                let calories = resp1[0].calorieBurnt[resp1[0].calorieBurnt.length - 1];
                                calories.push({
                                    'exercise' : exercise,
                                    'calories': calorie
                                });
                                let cal = resp1[0].calorieBurnt
                                cal[cal.length - 1] = calories;
                                await userModel.updateOne({
                                    email: email
                                }, {
                                    calorieBurnt: cal
                                }).then((resp3) => {
                                    res.status(200).send({
                                        'message': 'Data updated'
                                    })
                                }).catch((er3) => {
                                    res.status(400).send(er3);
                                })
        
                            }).catch((er2) => {
                                res.status(400).send(er2);
                            })
                        }
                    }).catch((er1) => {
                        res.status(400).send(er1);
                    });
                }).catch((er303) => {
                    res.status(400).send(er303);
                })


            }
        });
    
    }
    catch(e){
        console.log(e);
    }

}

module.exports = udateData;