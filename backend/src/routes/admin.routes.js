const express = require("express");
const prisma = require("../config/db");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const bcrypt = require("bcrypt");

const router = express.Router();

const {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAddress,
} = require("../utils/validators");

// 🔐 Admin only
router.use(auth);
router.use(role(["ADMIN"]));

/* ================= DASHBOARD ================= */
router.get("/dashboard", async (req, res) => {
  try {
    const users = await prisma.user.count();
    const stores = await prisma.store.count();
    const ratings = await prisma.rating.count();

    res.json({ users, stores, ratings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= CREATE USER ================= */
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

/* ================= GET ALL USERS ================= */
router.get("/users", async (req, res) => {
  const { sortBy, order, name, email, role } = req.query;

  const users = await prisma.user.findMany({
    where: {
      name: name ? { contains: name, mode: "insensitive" } : undefined,
      email: email ? { contains: email, mode: "insensitive" } : undefined,
      role: role || undefined,
    },
    orderBy: sortBy
      ? { [sortBy]: order === "desc" ? "desc" : "asc" }
      : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
    },
  });

  res.json(users);
});

/* ================= CREATE STORE ================= */
router.post("/stores", async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address || !ownerId) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!isValidName(name))
      return res
        .status(400)
        .json({ message: "Name must be 20–60 characters" });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    if (!isValidAddress(address))
      return res.status(400).json({ message: "Address too long" });

    const store = await prisma.store.create({
      data: { name, email, address, ownerId },
    });

    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET ALL STORES ================= */
router.get("/stores", async (req, res) => {
  const { sortBy, order, name, address } = req.query;

  const stores = await prisma.store.findMany({
    where: {
      name: name ? { contains: name, mode: "insensitive" } : undefined,
      address: address ? { contains: address, mode: "insensitive" } : undefined,
    },
    orderBy: sortBy
      ? { [sortBy]: order === "desc" ? "desc" : "asc" }
      : undefined,
    include: {
      ratings: true,
    },
  });

  res.json(stores);
});

module.exports = router;
