const mongoose = require('mongoose');

const UserMessage = mongoose.Schema({
    id :{
        type : String,
        require : true
    },
    credits :{
        type : Number,
        require : true
    },
    daily :{
        type : Number,
        require : false
    },
    banned :{
        type : Boolean,
        require : false
    },
})

module.exports = mongoose.model('data',UserMessage);