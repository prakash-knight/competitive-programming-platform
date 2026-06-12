const mongoose = require("mongoose");

// ─────────────────────────────────────────────
//  COUNTER  — tracks last problemId issued
// ─────────────────────────────────────────────
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },   // e.g. "problemId"
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.model("Counter", counterSchema);

// ─────────────────────────────────────────────
//  SHEET SCHEMA  — one document per DSA sheet
//  e.g. "Striver SDE Sheet", "Love Babbar 450"
// ─────────────────────────────────────────────
const sheetMetaSchema = new mongoose.Schema({
  sheetName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  totalQuestions: {
    type: Number,
    default: 0,
  },
});

// ─────────────────────────────────────────────
//  PROBLEM SCHEMA  — one document per problem
//  linked to a parent sheet via sheetId
// ─────────────────────────────────────────────
const problemSchema = new mongoose.Schema({
  // Human-readable unique ID  e.g. "P0001", "P0042"
  problemId: {
    type:   String,
    unique: true,
    index:  true,
    // set automatically in pre-save hook below
  },

  // Reference to the parent Sheet document
  sheetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sheet",
    required: true,
    index: true,
  },

  questionName: { type: String, required: true, trim: true, unique: true },
  topic:        { type: String, required: true, trim: true },
  question:     { type: String, default: "" },
  example:      { type: String, default: "" },
  explanation:  { type: String, default: "" },
  difficulty:   { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  platform:     { type: String, default: "LeetCode", trim: true },
  problemLink:  { type: String, default: "", trim: true },
});

// ─────────────────────────────────────────────
//  PRE-SAVE HOOK — auto-assign problemId once
// ─────────────────────────────────────────────
problemSchema.pre("save", async function (next) {
  // Only generate an ID for brand-new documents
  if (!this.isNew) return next();

  try {
    const counter = await Counter.findByIdAndUpdate(
      "problemId",                   // counter document id
      { $inc: { seq: 1 } },         // increment by 1
      { new: true, upsert: true }   // create if not exists
    );

    // Format: P0001, P0042, P1000 …
    this.problemId = "P" + String(counter.seq).padStart(4, "0");
    next();
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────
//  MODELS
// ─────────────────────────────────────────────
const Sheet   = mongoose.model("Sheet",   sheetMetaSchema);
const Problem = mongoose.model("Problem", problemSchema);

module.exports = { Sheet, Problem, Counter };