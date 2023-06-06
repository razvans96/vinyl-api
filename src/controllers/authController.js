const User = require("../models/User");
const jwt = require("../config/jwt");
const bcrypt = require("bcrypt");
const { JSONResponse } = require("../config/jsonResponse");

const verify = async (req, res, next) => {
  try {
    // Verificar el token de autenticación del usuario
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return JSONResponse(res, 401, {
        error: {
          code: "401",
          message:
            "Error de autentificación. El token no existe o el formato es incorrecto.",
        },
      });
    }
    const token = authHeader.split(" ")[1];
    req.user = jwt.verifyToken(token);
    console.log(req.user);
    next();
    // El token es válido y decodificado contiene la información del usuario
  } catch (error) {
    JSONResponse(res, 401, {
      error: {
        code: "401",
        message: "El token no es válido.",
      },
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Verificar si el nombre de usuario ya está registrado
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está registrado" });
    }

    // Crear un nuevo usuario
    const user = new User({ name, username, password: hashedPassword });
    await user.save();

    // Generar un token JWT para el usuario registrado
    const token = jwt.generateToken(user._id);

    // Responder con el token y los detalles del usuario
    res.status(201).json({
      message: "Registro exitoso",
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Error en el registro de usuario:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificar si el nombre de usuario existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar un token JWT para el usuario autenticado
    const token = jwt.generateToken(user._id);

    // Responder con el token y los detalles del usuario
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Error en el inicio de sesión:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { register, login, verify };
