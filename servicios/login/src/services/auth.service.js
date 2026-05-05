const supabase = require('../../db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const registrar = async (correo, contrasena) => {

    const { data: existing } = await supabase
        .from('usuarios')
        .select('*')
        .eq('correo', correo)
        .single();

    if (existing) {
        throw new Error('El usuario ya existe');
    }


    const hash = await bcrypt.hash(contrasena, SALT_ROUNDS);


    const { data, error } = await supabase
        .from('usuarios')
        .insert([{ correo, contrasena: hash }])
        .select();

    if (error) throw error;

    return data;
};


const login = async (correo, contrasena) => {

    const { data: user, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('correo', correo)
        .single();

    if (error || !user) {
        throw new Error('Usuario no encontrado');
    }

    const match = await bcrypt.compare(contrasena, user.contrasena);

    if (!match) {
        throw new Error('Contraseña incorrecta');
    }

    return {
        id_usuario: user.id_usuario,
        correo: user.correo
    };
};

module.exports = {
    registrar,
    login
};