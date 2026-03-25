import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

/* ---------- TEST ROUTE ---------- */
app.get("/", (req, res) => {
  res.send("NotesFlow API Running");
});

/* ---------- DATABASE ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

/* ---------- SERVER ---------- */
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
