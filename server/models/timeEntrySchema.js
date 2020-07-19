const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeEntrySchema = new Schema(
  {
    active: Boolean,
    startDate: Date,
    endDate: Date,
    task: { type: Schema.Types.ObjectId, ref: "task" },
  },
  { timestamps: true }
);

const TimeEntry = mongoose.model("timeEntry", timeEntrySchema);

module.exports = TimeEntry;
