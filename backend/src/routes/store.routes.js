const express = require("express");
const prisma = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= GET ALL STORES ================= */
router.get("/", auth, async (req, res) => {
  const { search, sortBy, order } = req.query;

  const stores = await prisma.store.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy:
      sortBy === "name" || sortBy === "address"
        ? { [sortBy]: order === "desc" ? "desc" : "asc" }
        : undefined,
    include: {
      ratings: true,
    },
  });

  let formatted = stores.map((store) => {
    const total = store.ratings.reduce((a, b) => a + b.value, 0);
    const avg =
      store.ratings.length > 0 ? total / store.ratings.length : 0;

    const myRating = store.ratings.find(
      (r) => r.userId === req.user.id
    );

    return {
      id: store.id,
      name: store.name,
      address: store.address,
      averageRating: Number(avg.toFixed(1)),
      userRating: myRating ? myRating.value : null,
    };
  });

  // Sort by rating if requested
  if (sortBy === "averageRating") {
    formatted.sort((a, b) =>
      order === "desc"
        ? b.averageRating - a.averageRating
        : a.averageRating - b.averageRating
    );
  }

  res.json(formatted);
});


module.exports = router;
