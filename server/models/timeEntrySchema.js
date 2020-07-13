const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeEntrySchema = new Schema(
  {
    elapsedTime: Number,
    active: Boolean,
    task: { type: Schema.Types.ObjectId, ref: "task" },
  },
  { timestamps: true }
);

const TimeEntry = mongoose.model("timeEntry", timeEntrySchema);

module.exports = TimeEntry;
