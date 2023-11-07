const mongoose = require('mongoose')

const tierSchema = new mongoose.Schema({
    nameTier:{
        type: String,
        required: true,
    },
    maxRequests:{
        type: Number,
        required: true,
    },
    requestsMade:{
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Tier', tierSchema);