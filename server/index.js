const express = require('express');
app.listen(3001, () => console.log('✅ Backend running on 3001'));

const cors = require("cors");
app.use(cors()); // allow all origins

const app = express();

app.use(cors());
app.use(express.json());

let notes = [];

// Get all notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// Create a new note
app.post('/api/notes', (req, res) => {
  const note = { id: Date.now(), text: req.body.text };
  notes.push(note);
  res.status(201).json(note);
});

// Update a note
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const index = notes.findIndex((n) => n.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: "Note not found" });

  notes[index].text = req.body.text;
  res.json(notes[index]);
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  notes = notes.filter((n) => n.id !== parseInt(id));
  res.status(204).end();
});

// Root route (health check)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


