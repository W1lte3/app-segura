require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const routes = require("./routes");
const logger = require("./logger");

const app = express();
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: "200kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// JWT middleware
app.use((req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token) {
    try { req.user = jwt.verify(token, process.env.JWT_SECRET); }
    catch { logger.warn("Token inválido"); }
  }
  next();
});

app.use("/api", routes);
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Servidor escuchando en :${port}`));
