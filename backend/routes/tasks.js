const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// Helper: parse pagination & filters
function parseQuery(req) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const perPage = Math.max(1, parseInt(req.query.perPage) || 10);
  const status = req.query.status || null; // 'pending' | 'completed' | 'in-progress' | 'active'
  const dateFrom = req.query.dateFrom || null; // YYYY-MM-DD
  const dateTo = req.query.dateTo || null;
  return { page, perPage, status, dateFrom, dateTo };
}

// GET /api/tasks/stats/global - global stats independent of UI filters
router.get('/stats/global', async (req, res) => {
  try {
    const total = await Task.countDocuments({}) || 0;
    const completed = await Task.countDocuments({ status: 'completed' }) || 0;
    const inProgress = await Task.countDocuments({ status: 'in-progress' }) || 0;
    const pending = await Task.countDocuments({ status: 'pending' }) || 0;

    const completionPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Explicitly return numbers (avoid accidental strings/undefined)
    res.json({
      total: Number(total),
      byStatus: {
        completed: Number(completed),
        inProgress: Number(inProgress),
        pending: Number(pending)
      },
      percent: Number(completionPercent),
      summary: {
        done: Number(completed),
        notDone: Number(total - completed)
      }
    });
  } catch (err) {
    console.error('Global stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/tasks - list with optional filters + pagination
router.get('/', async (req, res) => {
  try {
    const { page, perPage, status, dateFrom, dateTo } = parseQuery(req);
    const filter = {};

    if (status && status !== 'all') {
      if (status === 'active') filter.status = { $ne: 'completed' };
      else filter.status = status;
    }

    if (dateFrom || dateTo) {
      filter.dueDate = {};
      if (dateFrom) filter.dueDate.$gte = dateFrom;
      if (dateTo) filter.dueDate.$lte = dateTo;
    }

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ dueDate: 1, id: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    res.json({ tasks, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ id: Number(req.params.id) }).lean();
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { id, title, description, status, dueDate } = req.body;
    const _id = Number(id) || Date.now();
    const task = new Task({
      id: _id,
      title,
      description: description?.trim() || undefined,
      status,
      dueDate: dueDate || undefined,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(400).json({ error: 'Duplicate id' });
    res.status(400).json({ error: 'Invalid data' });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, status, dueDate } = req.body;
    const updated = await Task.findOneAndUpdate(
      { id: Number(id) },
      {
        title,
        description: description?.trim() || undefined,
        status,
        dueDate: dueDate || undefined,
      },
      { new: true, runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid data' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await Task.findOneAndDelete({ id }).lean();
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;