const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// boxes: { allTasks: { id: "allTasks", title: "All tasks", taskIds: [] } },

const boxSchema = new Schema({
  title: String,
  taskIds: [{ type: Schema.Types.ObjectId, ref: "task" }],
  time: Number,
});

module.exports = boxSchema;
