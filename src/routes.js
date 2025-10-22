const express = require("express");
const { validateLogin, loginHandler } = require("./auth");
const rbac = require("./rbac");
const router = express.Router();

router.post("/auth/login", validateLogin, loginHandler);
router.get("/items", (req, res) => res.json([{ id: 1, name: "safe item" }]));
router.get("/admin/metrics", rbac(["admin"]), (req, res) => res.json({ ok: true }));

module.exports = router;
