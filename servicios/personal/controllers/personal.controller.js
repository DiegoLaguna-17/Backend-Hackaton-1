const supabase = require('../db');

const agregarPersonal = async (req, res) => {
    const { 
        // Datos personal
        nombre, ci, fecha_ingreso, area, cargo, salario,
        // Datos contrato
        tiempo_prueba, contenido
    } = req.body;

    // Validaciones personal
    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    if (!cargo || cargo.trim() === '') {
        return res.status(400).json({ error: 'El cargo es obligatorio' });
    }
    if (!ci || ci.trim() === '') {
        return res.status(400).json({ error: 'El CI es obligatorio' });
    }
    if (!salario || Number(salario) <= 0) {
        return res.status(400).json({ error: 'El salario debe ser mayor a 0' });
    }
    if (!tiempo_prueba || tiempo_prueba.trim() === '') {
        return res.status(400).json({ error: 'El tiempo de prueba es obligatorio' });
    }

    // Verificar CI duplicado
    const { data: existe } = await supabase
        .from('personal')
        .select('id')
        .eq('ci', ci)
        .single();

    if (existe) {
        return res.status(409).json({ error: 'Ya existe un funcionario con ese CI' });
    }

    const { data: personalData, error: errorPersonal } = await supabase
        .from('personal')
        .insert([{
            nombre: nombre.trim(),
            ci: ci.trim(),
            fecha_ingreso,
            area,
            cargo: cargo.trim(),
            salario: Number(salario),
            estado: 'Activo'
        }])
        .select()
        .single();

    if (errorPersonal) {
        console.error(errorPersonal);
        return res.status(500).json({ error: 'Error al registrar el funcionario' });
    }

    const { data: contratoData, error: errorContrato } = await supabase
        .from('contratos')
        .insert([{
            id_personal: personalData.id,
            fecha_inicio: fecha_ingreso,
            salario: Number(salario),
            tiempo_prueba: tiempo_prueba.trim(),
            contenido: contenido || `Contrato de trabajo para ${nombre.trim()}`
        }])
        .select()
        .single();

    if (errorContrato) {
        console.error(errorContrato);
        return res.status(500).json({ error: 'Error al registrar el contrato' });
    }

    res.status(201).json({
        mensaje: 'Funcionario y contrato registrados exitosamente',
        funcionario: personalData,
        contrato: contratoData
    });
};

const darBajaPersonal = async (req, res) => {
    const { id } = req.params;

    const { data: funcionario } = await supabase
        .from('personal')
        .select('id, estado')
        .eq('id', id)
        .single();

    if (!funcionario) {
        return res.status(404).json({ error: 'Funcionario no encontrado' });
    }
    if (funcionario.estado === 'Inactivo') {
        return res.status(400).json({ error: 'El funcionario ya se encuentra inactivo' });
    }

    const { data, error } = await supabase
        .from('personal')
        .update({ estado: 'Inactivo' })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al dar de baja al funcionario' });
    }

    res.status(200).json({
        mensaje: 'Funcionario dado de baja correctamente',
        funcionario: data
    });
};

module.exports = { agregarPersonal, darBajaPersonal };