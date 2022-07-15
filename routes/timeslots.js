let express = require('express');
let router = express.Router();
const timeslotsController = require('../controllers/timeslots')
router.post('/',timeslotsController.getTimeslots);


module.exports = router;
