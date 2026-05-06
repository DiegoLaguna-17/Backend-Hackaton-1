const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');

// Registrar un nuevo pago
router.post('/registrar', pagosController.registrarPago);

// Listar pagos de un empleado específico
router.get('/empleado/:id', pagosController.listarPagosPorEmpleado);

module.exports = router;