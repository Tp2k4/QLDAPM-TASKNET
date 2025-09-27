// Simple Express + Mongoose server for TaskNet
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// routes
app.use('/api/tasks', tasksRouter);

app.get('/', (req, res) => res.send('TaskNet backend running'));

async function start() {
  const uri = (process.env.MONGO_URI || '').trim();

  if (!uri) {
    console.error('MONGO_URI is not set in .env. Please set MONGO_URI and restart the server.');
    process.exit(1);
  }

  // quick sanity check to catch obvious typing errors (wildcards, spaces, unfinished)
  if (uri.includes('*') || uri.includes('&') || /\s/.test(uri) || uri.endsWith('@') || uri.includes('mongodb+srv://@')) {
    console.error('MONGO_URI looks invalid. Make sure it has the format:');
    console.error('mongodb+srv://thophan:thophan230204@cluster0.0hyadlt.mongodb.net/Tasknet?retryWrites=true&w=majority');
    process.exit(1);
  }

  try {
    // Mongoose v7 uses unified topology by default; keep connect simple
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message || err);
    // print helpful guidance
    console.error('Check that MongoDB is reachable, the URI is correct and credentials are valid.');
    if (err && err.reason) console.error('Reason:', err.reason);
    process.exit(1);
  }
}
start();