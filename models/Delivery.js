const crypto = require('crypto')


class Delivery {

    constructor(status, selectedTimeslotId) {
        this.status = status;
        this.selectedTimeslotId = selectedTimeslotId;
        this.id = crypto.randomUUID()
    }


    setStatus(status) {
        this.status=status
    }


}


module.exports = Delivery
