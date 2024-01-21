const { google } = require('googleapis');
const request = require('request');
const urlParse = require('url-parse');
const queryPArse = require('query-string');
const login = (req, res) => {
    // const email = req.body.email;
    // console.log(email);
    // const state = { em : email};
    const oauth2Client = new google.auth.OAuth2(
        "611658826728-gp7el8t7t63g46o807c6unjd99tfg4lm.apps.googleusercontent.com",
        "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",
        "https://coachclient.vercel.app/sign"
        );
        
    const scopes = ["https://www.googleapis.com/auth/fitness.activity.read profile email openid"]
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
    })
    // res.send("Hiiii");
    // res.send(req.body.callbackURL);

    request(url, (err, response, body) => {
        console.log("error ", err);
        console.log("statusCode: ", response && response.statusCode);
        res.send({url});
        const queryURL = new urlParse(url);
        const code = queryPArse.parse(queryURL.query).client_id;
        console.log(code);
    })
}

module.exports = login;