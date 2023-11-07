const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        //unique:true
    },
    password:{
        type: String,
        required: true
    },
    preferredShortUrl:{
        type: String
    },
    nameTier:{
        type: String,
        required: true
    },
    
    tierId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tier",
       // required: true
    },
});

module.exports = mongoose.model('User', userSchema);