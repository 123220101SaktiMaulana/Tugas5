document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://notes-be101-981623652580.us-central1.run.app/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (!response.ok) {
            alert("Login gagal!");
            return;
        }

        const data = await response.json();
        localStorage.setItem("token", data.accessToken); //  simpan token

        // redirect ke halaman utama
        window.location.href = "index.html";
    } catch (err) {
        alert("Terjadi kesalahan saat login.");
    }
});