import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      default: "#ffffff", // default white note
    },

    isTrashed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* ✅ THIS LINE WAS MISSING */
const Note = mongoose.model("Note", noteSchema);

export default Note;
