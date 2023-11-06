const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique:true
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
    },
    tier:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tier'
    },
});

module.exports = mongoose.model('User', userSchema);