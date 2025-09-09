const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: { type: String, required: true },
  info: { type: String }
});

module.exports = mongoose.model("User", userSchema);
