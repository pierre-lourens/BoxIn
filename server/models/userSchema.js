const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: "task" }],
  timeEntries: [{ type: Schema.Types.ObjectId, ref: "timeEntry" }],
  googleId: String,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
