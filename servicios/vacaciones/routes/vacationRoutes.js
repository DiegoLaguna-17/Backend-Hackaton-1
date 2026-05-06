const express = require('express');
const router = express.Router();
const vacationController = require('../controllers/vacationController');

router.post('/asignar', vacationController.postVacation);

module.exports = router;
