const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({ text: String });
const projectSchema = new Schema({ text: String });

const taskSchema = new Schema(
  {
    text: String,
    scheduledDate: String,
    dueDate: String,
    status: String,
    tags: [tagSchema],
    timeEntries: [{ type: Schema.Types.ObjectId, ref: "timeEntry" }],
    projects: [projectSchema],
    estimatedTime: Number, // number of minutes & seconds
    actualTime: Number, // number of minutes & seconds
    weight: String,
    user: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const Task = mongoose.model("task", taskSchema);

module.exports = Task;
