const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    default: null,
  },

  country: {
    type: String,
    default: "",
  },

  education: {
    type: String,
    default: "",
  },

  goal: {
    type: String,
    default: "",
  },

  budget: {
    type: Number,
    default: 0,
  },

  skills: {
    type: [String],
    default: [],
  },

  experience: {
    type: String,
    default: "",
  },

  riskTolerance: {
    type: String,
    default: "",
  },

  timeCommitment: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
