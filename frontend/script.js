// script.js

const API_URL = 'https://notes-be101-981623652580.us-central1.run.app/notes';

// Fetch all notes

async function fetchNotes() {
    const response = await fetch(API_URL);
    const notes = await response.json();
    
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    notes.forEach(note => {
        notesList.innerHTML += `
            <div class="note">
                <h3>${note.judul}</h3>
                <p>${note.konten}</p>
                <button onclick="editNote(${note.id}, '${note.judul}', '${note.konten}')">Edit</button>
                <button onclick="deleteNote(${note.id})">Delete</button>
            </div>
        `;
    });
}

// Create or update a note
document.getElementById('noteForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('noteId').value;
    const judul = document.getElementById('judul').value;
    const konten = document.getElementById('konten').value;

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ judul, konten })
    });

    document.getElementById('noteForm').reset();
    document.getElementById('noteId').value = '';
    fetchNotes();
});

// Edit a note
function editNote(id, judul, konten) {
    document.getElementById('noteId').value = id;
    document.getElementById('judul').value = judul;
    document.getElementById('konten').value = konten;
}

// Delete a note
async function deleteNote(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    fetchNotes();
}


fetchNotes();
