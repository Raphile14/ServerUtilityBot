module.exports = class Utility {
    returnTimeUpdate() {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + " | UPDATE | ";
        return date;
    }

    returnTimeError() {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + " | ERROR | ";
        return date;
    }

    log(type, message) {
        // Legend
        // 0 - Update
        // 1 - Error
        if (type === 0) {
            console.log(this.returnTimeUpdate() + message);
        }        
        else if (type === 1) {
            console.log(this.returnTimeError() + message);
        }
    }
}