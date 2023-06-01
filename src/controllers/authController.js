const User = require('../models/User');
const { generateToken } = require('../config/jwt');

const register = async (req, res) => {
    
    try {
        const { username, password } = req.body;

        // Verificar si el nombre de usuario ya está registrado
        const existingUser = await User.findOne({ username });
        if (existingUser) {
        return res.status(400).json({ message: 'El nombre de usuario ya está registrado' });
        }

        // Crear un nuevo usuario
        const user = new User({ username, password });
        await user.save();

        // Generar un token JWT para el usuario registrado
        const token = generateToken(user._id);

        // Responder con el token y los detalles del usuario
        res.status(201).json({
        message: 'Registro exitoso',
        token,
        user: {
            id: user._id,
            username: user.username,
        },
        });
    } catch (err) {
        console.error('Error en el registro de usuario:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
       
};


const login = async (req, res) => {
    console.log('Hola login!');
};

module.exports = { register, login };
