const Timeslot = require('../models/Timeslot')
const fs = require('fs')
const store = require('../data/store')
exports.getTimeslots = (req, res) => {
    const timeslots = []
    const address = req.body.address
    Object.keys(store.timeslots).forEach(day => {
        store.timeslots[day].forEach(timeslot => {
            if (timeslot.supportedAddresses.includes(address))
                timeslots.push(new Timeslot(timeslot.startTime,timeslot.endTime,timeslot.supportedAddresses))
        })
    })
    res.status(200).send(timeslots)
}


