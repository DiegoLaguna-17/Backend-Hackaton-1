const pagosService = require('../services/pagosService');

const registrarPago = async (req, res) => {
    try {
        const { id_personal, monto, fecha, detalle } = req.body;

        // Validaciones básicas
        if (!id_personal || !monto || !fecha) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: id_personal, monto, fecha'
            });
        }

        if (monto <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El monto debe ser mayor a 0'
            });
        }

        // Registrar el pago
        const nuevoPago = await pagosService.registrarPago({
            id_personal,
            monto,
            fecha,
            detalle: detalle || null
        });

        res.status(201).json({
            success: true,
            message: 'Pago registrado exitosamente',
            data: nuevoPago
        });

    } catch (error) {
        console.error('Error en registrarPago:', error);
        
        // Manejo específico de errores
        if (error.message === 'personal_id_no_existe') {
            return res.status(404).json({
                success: false,
                message: 'El personal especificado no existe'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

//Listar pagos por empleado
const listarPagosPorEmpleado = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de personal inválido'
            });
        }

        const pagos = await pagosService.listarPagosPorPersonal(parseInt(id));

        // Sacamos los campos
        const pagosSimplificados = pagos.map(pago => ({
            id: pago.id,
            id_personal: pago.id_personal,
            monto: pago.monto,
            fecha: pago.fecha,
            detalle: pago.detalle
        }));

        res.status(200).json({
            success: true,
            data: pagosSimplificados
        });

    } catch (error) {
        console.error('Error:', error);
        
        if (error.message === 'personal_no_existe') {
            return res.status(404).json({
                success: false,
                message: 'Empleado no existe'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno'
        });
    }
};

module.exports = {
    registrarPago,
    listarPagosPorEmpleado
};