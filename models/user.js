const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    calorieBurnt : {
        type: Array
    },
    acctk:{
        type: String
    },
    reftk : {
        type: String
    },
    loctk : {
        type: String
    },
    lastupdt : {
        type: Date
    },
    todayDt: {
        type: String
    },
    calId: {
        type: String,
        required: true
    },
    exercise :{
        type: String
    }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;