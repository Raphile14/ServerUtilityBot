const mongoose = require('mongoose');

const reqSting = {
    type: String,
    required: true
};

const welcomeSchema = mongoose.Schema({
    _id: reqSting,
    channelId: reqSting,
    text: reqSting
});

module.exports = mongoose.model('welcome-channels', welcomeSchema);