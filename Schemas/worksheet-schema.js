const mongoose = require('mongoose');

const reqSting = {
    type: String,
    required: true
};

const reqArray = {
    type: Array,
    required: true
};

const worksheetSchema = mongoose.Schema({
    _id: reqSting,
    data: reqArray
});

module.exports = mongoose.model('worksheet-data', worksheetSchema);