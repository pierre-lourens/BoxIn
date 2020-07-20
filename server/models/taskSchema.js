const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({ text: String });
const projectSchema = new Schema({ text: String });

const taskSchema = new Schema(
  {
    text: String,
    scheduledDate: String,
    dueDate: String,
    status: { type: String, default: "incomplete" },
    tag: String,
    timeEntries: [{ type: Schema.Types.ObjectId, ref: "timeEntry" }],
    projects: [projectSchema],
    estimatedTime: { type: Number, default: 30 }, // number of minutes & seconds
    actualTime: { type: Number, default: 0 }, // number of milliseconds
    weight: String,
    user: { type: Schema.Types.ObjectId, ref: "user" },
    visibility: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const Task = mongoose.model("task", taskSchema);

module.exports = Task;
