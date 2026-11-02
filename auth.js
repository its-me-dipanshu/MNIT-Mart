
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

function showAuthMessage(message, type = "error") {
    const messageElement = document.getElementById("authMessage");

    if (!messageElement) {
        alert(message);
        return;
    }

    messageElement.textContent = message;
    messageElement.className = `auth-message ${type}`;
}

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            showAuthMessage("Please enter your email and password.");
            return;
        }

        const submitButton = loginForm.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.textContent = "Logging in...";

        try {
            const response = await fetch(`${AUTH_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Login failed.");
            }

            if (!result.token || !result.user) {
                throw new Error("Authentication response is incomplete.");
            }

            saveAuthData(result.token, result.user);
            updateAuthNavigation();

            showAuthMessage("Login successful! Redirecting...", "success");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 700);

        } catch (error) {
            showAuthMessage(error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Login";
        }
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!name || !email || !password || !confirmPassword) {
            showAuthMessage("Please fill in all fields.");
            return;
        }

        if (password.length < 8) {
            showAuthMessage("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showAuthMessage("Passwords do not match.");
            return;
        }

        const submitButton = registerForm.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.textContent = "Creating account...";

        try {
            const response = await fetch(`${AUTH_API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Registration failed.");
            }

            if (!result.token || !result.user) {
                throw new Error("Registration response is incomplete.");
            }

            saveAuthData(result.token, result.user);
            updateAuthNavigation();

            showAuthMessage("Account created successfully! Redirecting...", "success");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 700);

        } catch (error) {
            showAuthMessage(error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Register";
        }
    });
}
