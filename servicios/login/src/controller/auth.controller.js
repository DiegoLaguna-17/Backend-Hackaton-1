const { registrar, login } = require('../services/auth.service');

const registrarUsuario = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        const data = await registrar(correo, contrasena);

        res.json({
            ok: true,
            mensaje: 'Usuario registrado correctamente',
            usuario: data
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        const user = await login(correo, contrasena);

        res.json({
            ok: true,
            mensaje: 'Login exitoso',
            puedeContinuar: true,
            usuario: user
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            mensaje: error.message,
            puedeContinuar: false
        });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario
};