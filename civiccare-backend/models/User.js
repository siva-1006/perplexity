const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: false },
  info: { type: String, required: false },
});

module.exports = mongoose.model("User", userSchema);
