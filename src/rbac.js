module.exports = (rolesAllowed = []) => (req, res, next) => {
  if (!req.user || !rolesAllowed.includes(req.user.role)) return res.status(403).json({ error: "Acceso denegado" });
  next();
};
