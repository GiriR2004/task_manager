const Task = require('../models/Task'); // The new schema with email + tasks array
const mongoose = require('mongoose');

exports.getTasks = async (req, res) => {
  try {
    const email = req.user.email; // get user email from req.user set by auth middleware
    const userTasksDoc = await Task.findOne({ email });
    if (!userTasksDoc) {
      return res.json({ tasks: [] }); // no tasks yet
    }
    res.json({ tasks: userTasksDoc.tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const email = req.user.email;
    const newTask = req.body; // { title, description, dueDate, status }

    console.log(email, newTask);

    // Add the new task to user's task array, create user doc if doesn't exist
    const userTasksDoc = await Task.findOneAndUpdate(
      { email },
      { $push: { tasks: newTask } },
      { new: true, upsert: true }
    );

    res.status(201).json(userTasksDoc.tasks[userTasksDoc.tasks.length - 1]); // return the newly added task
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const email = req.user.email;
    const taskId = req.params.id;
    const updateData = req.body;

    // Find the user doc and update the specific task in the array
    const userTasksDoc = await Task.findOneAndUpdate(
      { email, "tasks._id": taskId },
      { $set: { "tasks.$": { ...updateData, _id: taskId } } },
      { new: true }
    );

    if (!userTasksDoc) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Return the updated task
    const updatedTask = userTasksDoc.tasks.find(t => t._id.toString() === taskId);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const email = req.user.email;
    const taskId = req.params.id;

    // Remove the task from the tasks array
    const userTasksDoc = await Task.findOneAndUpdate(
      { email },
      { $pull: { tasks: { _id: taskId } } },
      { new: true }
    );

    if (!userTasksDoc) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
