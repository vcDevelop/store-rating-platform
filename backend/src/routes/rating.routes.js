const express = require("express");
const prisma = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= SUBMIT / UPDATE RATING ================= */
router.post("/", auth, async (req, res) => {
  const { storeId, value } = req.body;

  if (value < 1 || value > 5) {
    return res.status(400).json({ message: "Rating must be 1 to 5" });
  }

  const rating = await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId: req.user.id,
        storeId
      }
    },
    update: { value },
    create: {
      value,
      userId: req.user.id,
      storeId
    }
  });

  res.json(rating);
});

module.exports = router;
