const supabase = require('../db');

class PagosService {
    async registrarPago(pagoData) {
        // Primero verificamos que el personal exista
        const { data: personal, error: personalError } = await supabase
            .from('personal')
            .select('id, nombre, salario')
            .eq('id', pagoData.id_personal)
            .single();

        if (personalError || !personal) {
            throw new Error('personal_id_no_existe');
        }

        // Insertamos el pago
        const { data: nuevoPago, error: pagoError } = await supabase
            .from('pagos')
            .insert([
                {
                    id_personal: pagoData.id_personal,
                    monto: pagoData.monto,
                    fecha: pagoData.fecha,
                    detalle: pagoData.detalle
                }
            ])
            .select(`
                *,
                personal:personal (
                    nombre,
                    ci,
                    cargo
                )
            `)
            .single();

        if (pagoError) {
            throw new Error(`Error al insertar pago: ${pagoError.message}`);
        }

        return nuevoPago;
    }

    async listarPagosPorPersonal(id_personal) {
        // Primero verificamos que el personal exista
        const { data: personalExists, error: personalError } = await supabase
            .from('personal')
            .select('id')
            .eq('id', id_personal)
            .single();

        if (personalError || !personalExists) {
            throw new Error('personal_no_existe');
        }

        // Listamos todos los pagos del personal
        const { data: pagos, error } = await supabase
            .from('pagos')
            .select(`
                *,
                personal:personal (
                    nombre,
                    ci,
                    cargo,
                    area,
                    salario,
                    fecha_ingreso,
                    estado
                )
            `)
            .eq('id_personal', id_personal)
            .order('fecha', { ascending: false }); // Ordenar del más reciente al más antiguo

        if (error) {
            throw new Error(`Error al listar pagos: ${error.message}`);
        }

        return pagos || [];
    }
}

module.exports = new PagosService();