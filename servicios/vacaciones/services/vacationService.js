const supabase = require('../db');

const assignVacation = async (id_personal, gestion) => {
  const { data: employee, error: empError } = await supabase
    .from('personal')
    .select('fecha_ingreso')
    .eq('id', id_personal)
    .single();

  if (!employee) throw new Error('Empleado no encontrado');

  const entryDate = new Date(employee.fecha_ingreso);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  if (entryDate > oneYearAgo) {
    throw new Error('El funcionario debe tener al menos 1 año de antigüedad');
  }

  const { data: existing } = await supabase
    .from('vacaciones')
    .select('id')
    .eq('id_personal', id_personal)
    .eq('gestion', gestion);

  if (existing && existing.length > 0) {
    throw new Error(`La gestión ${gestion} ya fue asignada previamente`);
  }

  const { data, error } = await supabase
    .from('vacaciones')
    .insert([
      {
        id_personal,
        gestion,
        dias_asignados: 15,
        dias_usados: 0,
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

module.exports = { assignVacation };
