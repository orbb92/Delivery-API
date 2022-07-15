const express = require('express')
require('dotenv').config()
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const store = require('./data/store')
const timeslots = require('./data/courierAPI')
const deliveryRouter = require('./routes/deliveries')
const timeslotsRouter = require('./routes/timeslots')
const resolveAddressRouter = require('./routes/resolveAddress')
const app = express()
const {HolidayAPI} = require('holidayapi')
const holidayAPI = new HolidayAPI({key: process.env.HOLIDAY_API_KEY})
app.use(logger('dev'));
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const crypto = require('crypto');
const port = 8080

//*****************just for assignment -> create sometimeslots
const init = () => {
    Object.keys(timeslots).forEach(day => {

        timeslots[day].push(
            {
                "startTime": "7", "endTime": "9", "supportedAddresses": ['kefar yona', 'jerusalem']
            },
            {
                "startTime": "9",
                "endTime": "11",
                "supportedAddresses": ['kefar yona', 'jerusalem']
            }, {"startTime": "11", "endTime": "13", "supportedAddresses": ['tel aviv']}, {
                "startTime": "13",
                "endTime": "15",
                "supportedAddresses": ['tel aviv', 'ramat gan']
            }, {"startTime": "15", "endTime": "17", "supportedAddresses": ['eilat']})
    })
}
init()
//**********************************************************//


Object.keys(timeslots).forEach(timeslot => {
    Promise.all([timeslot, holidayAPI.holidays({country: 'IL', year: '2021'})]).then(value => {
        const isHoliday = value[1].holidays.find(holiday => holiday.date === value[0])
        if (!isHoliday) {
            store.timeslots[value[0]]={}
            timeslots[timeslot].forEach(slot=>{

                const hash = crypto.createHash('md5').update(JSON.stringify(slot)+timeslot).digest('hex');
                store.timeslots[value[0]][hash] =slot

            })
          }
    })

})


app.use('/deliveries', deliveryRouter);
app.use('/timeslots', timeslotsRouter);
app.use('/resolve-address', resolveAddressRouter)

app.listen(port, () => {
    console.log(`server is up on port ${port}`)
})
module.exports = app;
