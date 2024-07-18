document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutButton = document.getElementById('logout-button');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            fetch('http://localhost:8000/account/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.token) {
                        localStorage.setItem('access_token', data.token.access);
                        localStorage.setItem('refresh_token', data.token.refresh);
                        window.location.href = 'index.html';
                    } else {
                        document.getElementById('login-error').innerText = data.errors.non_field_errors[0] || 'Login failed';
                    }
                })
                .catch(error => console.error('Error logging in:', error));
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const passwordConfirmation = document.getElementById('password-confirmation').value;
            const tc = document.getElementById('tc').checked;

            fetch('http://localhost:8000/account/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    email,
                    password,
                    password2: passwordConfirmation,
                    tc
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.token) {
                        localStorage.setItem('access_token', data.token.access);
                        localStorage.setItem('refresh_token', data.token.refresh);
                        window.location.href = 'index.html';
                    } else {
                        document.getElementById('register-error').innerText = data.errors.non_field_errors[0] || 'Registration failed';
                    }
                })
                .catch(error => console.error('Error registering:', error));
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Logout button clicked'); // Check if this logs in the console
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = 'login.html';
        });
    }
    
});
