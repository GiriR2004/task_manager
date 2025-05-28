const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware'); // import your auth middleware

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// Apply protect middleware to all routes below
router.use(protect);

router.get('/get', getTasks);
router.post('/create', createTask);
router.put('/update/:id', updateTask);
router.delete('/del/:id', deleteTask);

module.exports = router;
