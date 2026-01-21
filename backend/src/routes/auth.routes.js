const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const router = express.Router();

const {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAddress,
} = require("../utils/validators");

router.post("/users", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔐 VALIDATIONS
    if (!isValidName(name))
      return res
        .status(400)
        .json({ message: "Name must be 20–60 characters" });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    if (!isValidPassword(password))
      return res.status(400).json({
        message: "Password must contain 1 uppercase & 1 special character",
      });

    if (!isValidAddress(address))
      return res.status(400).json({ message: "Address too long" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
