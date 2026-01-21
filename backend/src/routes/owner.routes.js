const express = require("express");
const prisma = require("../config/db");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

router.use(auth);
router.use(role(["STORE_OWNER"]));

router.get("/dashboard", async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { ownerId: req.user.id },
    include: {
      ratings: {
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      }
    }
  });

  if (!store) {
    return res.status(404).json({ message: "Store not found" });
  }

  const avg =
    store.ratings.reduce((a, b) => a + b.value, 0) /
    (store.ratings.length || 1);

  res.json({
    storeName: store.name,
    averageRating: Number(avg.toFixed(1)),
    ratings: store.ratings.map(r => ({
      user: r.user.name,
      email: r.user.email,
      rating: r.value
    }))
  });
});

module.exports = router;
