let express = require('express');
let router = express.Router();
let axios = require('axios')
const resolveAddressController = require('../controllers/resolveAddress')
router.post('/',resolveAddressController.resolveAddress);


module.exports = router;
