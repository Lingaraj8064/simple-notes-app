import React, { useEffect, useState } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch notes from backend
  useEffect(() => {
    fetch("https://simple-notes-app-iro5.onrender.com/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  // Add or update note
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (editId) {
      // Update note
      fetch(`http://simple-notes-app-iro5.onrender.com/api/notes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
        .then((res) => res.json())
        .then((updatedNote) => {
          setNotes(notes.map((n) => (n.id === editId ? updatedNote : n)));
          setEditId(null);
          setText("");
        });
    } else {
      // Create new note
      fetch("http://simple-notes-app-iro5.onrender.com/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
        .then((res) => res.json())
        .then((newNote) => {
          setNotes([...notes, newNote]);
          setText("");
        });
    }
  };

  // Edit note
  const handleEdit = (note) => {
    setEditId(note.id);
    setText(note.text);
  };

  // Delete note
  const handleDelete = (id) => {
    fetch(`http://simple-notes-app-iro5.onrender.com/api/notes/${id}`, {
      method: "DELETE",
    }).then(() => {
      setNotes(notes.filter((n) => n.id !== id));
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h1>📝 Simple Notes App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note..."
          style={{ width: "70%", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 12px", marginLeft: "5px" }}>
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {notes.map((note) => (
          <li
            key={note.id}
            style={{
              background: "#f4f4f4",
              padding: "10px",
              marginBottom: "8px",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {note.text}
            <span>
              <button onClick={() => handleEdit(note)} style={{ marginRight: "5px" }}>
                ✏️ Edit
              </button>
              <button onClick={() => handleDelete(note.id)}>🗑️ Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
