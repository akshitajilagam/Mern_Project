import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

/* ---------------- CREATE NOTE ---------------- */
router.post("/", async (req, res) => {
  try {
    const { userId, title, content, color } = req.body;

    const newNote = new Note({
      userId,
      title,
      content,
      color: color || "#ffffff",
    });

    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- GET USER TRASH ---------------- */

router.get("/trash/all/:userId", async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.params.userId,
      isTrashed: true,
    });

    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- GET USER NOTES ---------------- */

router.get("/user/:userId", async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.params.userId,
      isTrashed: false,
    });

    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- GET ALL NOTES ---------------- */
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ isTrashed: false });
    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).lean();

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    console.log("SINGLE NOTE SENT:", note); // debug

    res.json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- UPDATE NOTE ---------------- */

router.put("/:id", async (req, res) => {
  try {
    const { title, content, color } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content,color },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(updatedNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- MOVE TO TRASH ---------------- */

router.patch("/:id/trash", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { isTrashed: true },
      { new: true }
    );

    res.json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------- RESTORE NOTE ---------------- */

router.patch("/:id/restore", async (req, res) => {
  try {
    console.log("RESTORE ID:", req.params.id); // 👈 ADD THIS

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { isTrashed: false },
      { new: true }
    );

    res.json(note);
  } catch (error) {
    console.log("RESTORE ERROR:", error); // 👈 ADD THIS
    res.status(500).json({ message: "Server Error" });
  }
});


/* ---------------- DELETE NOTE ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(
      req.params.id
    );

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
