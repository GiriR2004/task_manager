const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // One document per user
  },
  tasks: [
    {
      title: {
        type: String,
        required: true,
      },
      description: String,
      dueDate: String, // still as String, ideally should be Date
      status: {
        type: String,
        enum: ['open', 'completed'],
        default: 'open',
      },
      reminded: {
        type: Boolean,
        default: false,
      },
    }
  ],
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
