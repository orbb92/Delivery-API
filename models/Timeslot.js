const crypto = require("crypto");

class Timeslot {
    constructor(startTime, endTime, supportedAddresses) {
        this.startTime = startTime;
        this.endTime=endTime;
        this.supportedAddresses=supportedAddresses
        this.id = crypto.randomUUID()

    }


}


module.exports = Timeslot
