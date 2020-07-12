const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    text: String,
    scheduledDate: String,
    status: String,
    timeEstimate: String,
    actualTime: String,
    weight: String,
    tags: [tagSchema],
    projects: [{ type: Schema.Types.ObjectId, ref: "project" }],
    userID: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Task = mongoose.model("task", taskSchema);
module.exports = Task;
