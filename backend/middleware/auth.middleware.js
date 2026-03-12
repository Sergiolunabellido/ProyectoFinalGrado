const jwt = require("jsonwebtoken");

/**
 * @brief Middleware que valida el token JWT.
 * @fecha 2026-01-20
 * @returns {void} Continua o responde con error.
 */

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.id_usuario = decoded.id_usuario
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" });
    }
    return res.status(401).json({ message: "Token inválido, Debes iniciar sesion." });
  }
};
