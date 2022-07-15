const Delivery = require('../models/Delivery')
const store = require('../data/store')
exports.getDaily = (req, res) => {
    const today = new Date().toISOString().split('T')[0]
    const todayDeliveries = []
    const timeslotIdsForToday = Object.keys(store.timeslots[today])
    Object.keys(store.deliveries).forEach(deliveryId => {
        if (timeslotIdsForToday.includes(store.deliveries[deliveryId].id))
            todayDeliveries.push(store.deliveries[deliveryId])
    })
    res.status(200).send(todayDeliveries)


}

exports.getWeekly = (req, res) => {
    const weeklyDeliveries = []
    Object.keys(store.deliveries).forEach(deliveryId => {
        weeklyDeliveries.push(store.deliveries[deliveryId])
    })
    res.status(200).send(weeklyDeliveries)
}

exports.cancelDelivery = (req, res) => {
    const id = req.param.id
    delete store.deliveries[id]
    if (store.deliveries[id]) {
        delete store.deliveries[id]
        res.status(200).send('delivery deleted')
    } else {
        res.status(404).send('no such delivery')
    }


}

exports.markDelivery = (req, res) => {
    const id = req.params.id
    const delivery = store.deliveries[id]
    delivery.setStatus('delivered')
    res.status(200).send('status changed to delivery')

}

exports.validateBooking = (req, res, next) => {
    try {
        const getDayOfDelivery = () => {
            let d;
            Object.keys(store.timeslots).forEach(day => {
                if (Object.keys(store.timeslots[day]).includes(req.body.timeslotId)) {
                    d = day
                }
            })
            return d
        }
        const getNumberOfDeliveries = (day) => {
            let count = 0
            const slotsOfDay = Object.keys(store.timeslots[day])
            Object.keys(store.deliveries).forEach(deliveryId => {
                if (slotsOfDay.includes(store.deliveries[deliveryId].selectedTimeslotId))
                    ++count

            })

            return count
        }
        const getTimeslotCount = () => {
            let count = 0
            Object.keys(store.deliveries).forEach(deliveryId => {
                if (store.deliveries[deliveryId].selectedTimeslotId === req.body.timeslotId)
                    count++
            })
            return count

        }

        const dayOfDeliveries = getDayOfDelivery()
        const numberOfDeliveriesPerDay = getNumberOfDeliveries(dayOfDeliveries)
        const numberOfDeliveriesPerSlot = getTimeslotCount()

        if (numberOfDeliveriesPerDay < 10 && numberOfDeliveriesPerSlot < 2)
            next()
        else {
            res.status(202).send('Capacity error')        }

    } catch (e) {

        res.status(400).send('incorrect timeslotId')
    }
}

exports.bookDelivery = (req, res) => {
    console.log('from booking')
    const user = req.body.user
    const timeslotId = req.body.timeslotId
    const delivery = new Delivery('booked', timeslotId)
    store.deliveries[delivery.id] = delivery
    res.status(200).send('recieved a dilvery')

}
