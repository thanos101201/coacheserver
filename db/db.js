const mongoose = require('mongoose');
let db = "mongodb+srv://pratik:pratik@cluster0.17656ze.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(db).then(() => {
    console.log("Connection successfull!!");
}).catch((er) => {
    console.log(er);
});