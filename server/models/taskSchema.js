const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    text: String,
    scheduledDate: String,
    status: String,
    tags: Array,
    timeEstimate: String,
    actualTime: String,
    weight: String,
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Task = mongoose.model("task", taskSchema);
module.exports = Task;
