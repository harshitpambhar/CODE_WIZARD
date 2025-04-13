document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = { email, password };

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const errorElement = document.getElementById("loginError");

    if (response.status === 200) {
        alert("Login successful!");
        window.location.href = "/dashboard";
    } else if (response.status === 401) {
        errorElement.textContent = "Invalid credentials.";
        errorElement.classList.remove("hidden");
    } else {
        errorElement.textContent = "Something went wrong.";
        errorElement.classList.remove("hidden");
    }
}); 