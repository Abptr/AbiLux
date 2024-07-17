document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const message = document.getElementById('message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        message.textContent = '';

        const username = loginForm.username.value;
        const password = loginForm.password.value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                message.textContent = data.message;
                // Redirect or perform actions after successful login
                // For demo purposes, you can redirect to another page
                setTimeout(() => {
                    window.location.href = '/dashboard.html'; // Replace with your actual dashboard page
                }, 1000);
            } else {
                message.textContent = data.message;
            }
        } catch (error) {
            console.error('Error:', error);
            message.textContent = 'An error occurred. Please try again later.';
        }
    });
});
