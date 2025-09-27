const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true }, // numeric id for frontend compatibility
  title: { type: String, required: true },
  description: { type: String, default: undefined }, // <-- thêm trường description
  status: { type: String, enum: ['completed','pending','in-progress'], default: 'pending' },
  dueDate: { type: String }, // store YYYY-MM-DD
}, {
  timestamps: true
});

// create index for id
TaskSchema.index({ id: 1 }, { unique: true });

module.exports = mongoose.model('Task', TaskSchema);