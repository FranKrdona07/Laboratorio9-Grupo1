import jwt from "jsonwebtoken";
const JWT_SECRET = "secretkey"; // o process.env.JWT_SECRET si usas variable de entorno

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No se proporcionó token" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Formato de token inválido" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado" });
    }
    req.user = decoded; // guarda la info del usuario decodificada
    next();
  });
};
