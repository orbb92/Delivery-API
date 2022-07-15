let express = require('express');
let router = express.Router();
let deliveryController = require('../controllers/deliveries')

router.post('/',[deliveryController.validateBooking,deliveryController.bookDelivery]);
router.post('/:id/complete',deliveryController.markDelivery)
router.delete('/:id',deliveryController.cancelDelivery);
router.get('/daily',deliveryController.getDaily);
router.get('/weekly',deliveryController.getWeekly);


module.exports = router;
