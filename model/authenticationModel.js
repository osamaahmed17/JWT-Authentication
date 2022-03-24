const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clientId: { type: String},
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);