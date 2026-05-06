const express = require('express');
const router = express.Router();
const { agregarPersonal, darBajaPersonal } = require('../controllers/personal.controller');

router.post('/', agregarPersonal);
router.patch('/:id/baja', darBajaPersonal);

module.exports = router;