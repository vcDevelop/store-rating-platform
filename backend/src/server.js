const express = require("express");
const cors = require("cors");
const profileRoutes = require("./routes/profile.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const storeRoutes = require("./routes/store.routes");
const ratingRoutes = require("./routes/rating.routes");
const ownerRoutes = require("./routes/owner.routes");
const app = express();

// 🔥 THESE MUST BE ABOVE ALL ROUTES
app.use(cors());
app.use(express.json());
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/owner", ownerRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
