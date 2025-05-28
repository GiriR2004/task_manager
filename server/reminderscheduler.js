const cron = require('node-cron');
const Task = require('./models/Task');
const sendEmail = require('./utils/sendEmail');

// Runs every hour
cron.schedule('0 * * * *', async () => {
  console.log('⏰ Checking for tasks due within 1 hour...');

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  try {
    const allUsers = await Task.find();

    for (const user of allUsers) {
      let tasksUpdated = false;

      for (const task of user.tasks) {
        const due = new Date(task.dueDate); // Convert from string to Date

        if (
          task.status === 'open' &&
          !task.reminded &&
          due >= now &&
          due <= oneHourLater
        ) {
          await sendEmail(
            user.email,
            '⏰ Task Reminder',
            `Hi, your task "${task.title}" is due at ${due.toLocaleString()}. Please complete it soon.`
          );

          task.reminded = true;
          tasksUpdated = true;
        }
      }

      if (tasksUpdated) {
        await user.save(); // Save changes only if reminders were sent
      }
    }
  } catch (err) {
    console.error('❌ Error checking tasks:', err);
  }
});
