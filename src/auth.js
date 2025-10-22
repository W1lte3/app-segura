const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("./db");

const validateLogin = [
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
];

async function registerUser(email, password, role = "user") {
  const hash = await bcrypt.hash(password, 12);
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO users(email,password_hash,role) VALUES(?,?,?)",
      [email, hash, role],
      function (err) { if (err) return reject(err); resolve(this.lastID); }
    );
  });
}

function loginHandler(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: "Credenciales inválidas" });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  });
}

module.exports = { registerUser, validateLogin, loginHandler };
