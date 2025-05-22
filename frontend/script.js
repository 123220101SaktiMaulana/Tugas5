const API_URL = 'https://notes-be101-981623652580.us-central1.run.app';
// const API_URL = 'http://localhost:5000';

// Ambil token dari localStorage
const token = localStorage.getItem('token');

// Cek jika token tidak ada dan user ada di index.html → redirect ke login
if (!token && (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/'))) {
    window.location.href = 'login.html';
}

// Fungsi untuk menangani session expired
function handleSessionExpired() {
    alert('Sesi Anda telah habis. Silakan login ulang.');
    localStorage.removeItem('token');

    // Hentikan refresh interval jika ada
    if (window.refreshIntervalId) {
        clearInterval(window.refreshIntervalId);
    }

    window.location.href = 'login.html';
}

// Fungsi untuk memeriksa respons API jika token tidak valid
function checkTokenValidity(response) {
    if (response.status === 401 || response.status === 403) {
        handleSessionExpired();
        return false;
    }
    return true;
}

// Fungsi untuk melakukan request API dengan validasi token
async function apiRequest(url, options = {}) {
    try {
        // Pastikan header authorization selalu ada
        if (!options.headers) {
            options.headers = {};
        }
        options.headers.Authorization = `Bearer ${token}`;

        const response = await fetch(url, options);

        // Cek validitas token untuk semua request
        if (!checkTokenValidity(response)) {
            return null;
        }

        return response;
    } catch (err) {
        console.error("API Request Error:", err);
        throw err;
    }
}

// Fungsi untuk mengambil semua catatan
async function fetchNotes() {
    try {
        const response = await apiRequest(`${API_URL}/Notes`);

        // Jika respons null, berarti session expired dan sudah dialihkan
        if (!response) return;

        if (!response.ok) {
            throw new Error("Gagal mengambil catatan");
        }

        const notes = await response.json();
        const notesList = document.getElementById('notesList');

        if (!notesList) {
            console.error("Element dengan id 'notesList' tidak ditemukan");
            return;
        }

        notesList.innerHTML = '';

        if (notes.length === 0) {
            notesList.innerHTML = '<p>Belum ada catatan. Buat catatan baru!</p>';
            return;
        }

        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';

            const titleElement = document.createElement('h3');
            titleElement.textContent = note.judul;

            const contentElement = document.createElement('p');
            contentElement.textContent = note.konten;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editNote(note.id, note.judul, note.konten);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteNote(note.id);

            noteElement.appendChild(titleElement);
            noteElement.appendChild(contentElement);
            noteElement.appendChild(editButton);
            noteElement.appendChild(deleteButton);

            notesList.appendChild(noteElement);
        });
    } catch (err) {
        console.error("Error:", err);
        alert("Gagal mengambil catatan. Mohon coba lagi.");
    }
}

// Fungsi untuk membuat atau memperbarui catatan
const form = document.getElementById('noteForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('noteId').value;
        const judul = document.getElementById('judul').value;
        const konten = document.getElementById('konten').value;

        try {
            const method = id ? 'PATCH' : 'POST';
            const url = id ? `${API_URL}/Notes/${id}` : `${API_URL}/Notes`;

            const response = await apiRequest(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    judul,
                    konten
                })
            });

            // Jika respons null, berarti session expired dan sudah dialihkan
            if (!response) return;

            if (!response.ok) {
                const errorData = await response.json();
                alert('Gagal menyimpan catatan: ' + (errorData.msg || 'Terjadi kesalahan'));
                return;
            }

            form.reset();
            document.getElementById('noteId').value = '';
            fetchNotes();
        } catch (err) {
            console.error("Error:", err);
            alert('Gagal menyimpan catatan. Mohon coba lagi.');
        }
    });
}

// Fungsi untuk menghapus catatan
async function deleteNote(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
        return;
    }

    try {
        const response = await apiRequest(`${API_URL}/Notes/${id}`, {
            method: 'DELETE'
        });

        // Jika respons null, berarti session expired dan sudah dialihkan
        if (!response) return;

        if (!response.ok) {
            const errorData = await response.json();
            alert('Gagal menghapus catatan: ' + (errorData.msg || 'Terjadi kesalahan'));
            return;
        }

        fetchNotes();
    } catch (err) {
        console.error("Error:", err);
        alert('Gagal menghapus catatan. Mohon coba lagi.');
    }
}

// Fungsi untuk mengisi form saat edit
function editNote(id, judul, konten) {
    document.getElementById('noteId').value = id;
    document.getElementById('judul').value = judul;
    document.getElementById('konten').value = konten;

    // Scroll ke form agar user bisa edit
    document.getElementById('noteForm').scrollIntoView({
        behavior: 'smooth'
    });
}

// Fungsi logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            // Coba logout dari backend untuk menghapus refresh token cookie
            await fetch(`${API_URL}/logout`, {
                method: 'DELETE',
                credentials: 'include' // Penting untuk cookies
            });
        } catch (error) {
            console.error('Error saat logout:', error);
        } finally {
            // Hapus token dari localStorage
            localStorage.removeItem('token');

            // Hentikan refresh interval jika ada
            if (window.refreshIntervalId) {
                clearInterval(window.refreshIntervalId);
            }

            // Redirect ke login
            window.location.href = 'login.html';
        }
    });
}

// Fungsi untuk refresh token secara periodik
function setupTokenRefresh() {
    // Refresh token setiap 10 detik, karena token expire setiap 15 detik
    const REFRESH_INTERVAL = 10 * 1000; // 10 detik

    const refreshIntervalId = setInterval(async () => {
        try {
            // Gunakan endpoint refresh token yang sudah ada
            const response = await fetch(`${API_URL}/token`, {
                method: 'GET',
                credentials: 'include' // Penting untuk mengirim cookies
            });

            if (response.ok) {
                const data = await response.json();
                if (data.accessToken) {
                    localStorage.setItem('token', data.accessToken);
                    console.log('Token berhasil di-refresh');
                }
            } else if (response.status === 401 || response.status === 403) {
                clearInterval(refreshIntervalId);
                handleSessionExpired();
            }
        } catch (error) {
            console.error('Gagal refresh token:', error);
        }
    }, REFRESH_INTERVAL);

    return refreshIntervalId;
}

// Jalankan hanya jika di index.html atau halaman root
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    // Tunggu DOM selesai loading
    document.addEventListener('DOMContentLoaded', () => {
        fetchNotes();

        // Aktifkan refresh token otomatis dan simpan ID-nya di variabel global
        // agar bisa diakses dari handleSessionExpired
        window.refreshIntervalId = setupTokenRefresh();
    });

    // Tambahkan event listener untuk membersihkan interval saat user meninggalkan halaman
    window.addEventListener('beforeunload', () => {
        if (window.refreshIntervalId) {
            clearInterval(window.refreshIntervalId);
        }
    });
}