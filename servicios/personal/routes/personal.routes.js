const express = require('express');
const router = express.Router();
const { agregarPersonal, darBajaPersonal, obtenerPersonal, listarPersonal, modificarPersonal } = require('../controllers/personal.controller');

router.post('/', agregarPersonal);
router.get('/', listarPersonal);
router.get('/:id', obtenerPersonal);
router.put('/:id', modificarPersonal);
router.patch('/:id/baja', darBajaPersonal);

module.exports = router;