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
    lastUpDt : {
        type: Date
    }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;