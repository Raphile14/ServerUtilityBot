const mongoose = require('mongoose');

module.exports = class Mongo {
    constructor (path) {
        this.path = path;
    }

    async connect() {
        await mongoose.connect(this.path, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        return mongoose;
    }
}