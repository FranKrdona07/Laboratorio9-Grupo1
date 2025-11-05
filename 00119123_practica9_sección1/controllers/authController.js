import { pool } from '../data/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



// ⚙️ Usa una variable de entorno para mayor seguridad
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Buscar usuario por email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 2️⃣ Comparar contraseña encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // 3️⃣ Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4️⃣ Devolver respuesta
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Error en inicio de sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const protectedRoute = (req, res) => {
  res.status(200).json({
    message: "Accediste a una ruta protegida correctamente",
    user: req.user
  });
};
