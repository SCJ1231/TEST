const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  명령: String,
  명령어: String,
  id: Number,
});

module.exports = mongoose.model("Message", MessageSchema);
