const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const aiRoutes = require("./src/routes/aiRoutes");

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// Exposes POST /api/generate-plan and GET /api/ai-status
app.use("/api", aiRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,

    message: "AI Life OS Backend Running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
  });
});

const PORT = 5000;

connectDB();
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
