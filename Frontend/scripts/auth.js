document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutButton = document.getElementById('logout-button');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const profileDropdown = document.getElementById('profile-dropdown');

    function checkToken() {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (accessToken && refreshToken) {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const expiration = payload.exp * 1000;
            const now = new Date().getTime();

            if (expiration > now) {
                return true;
            } else {
                fetch('http://localhost:8000/api/token/refresh/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh: refreshToken }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.access) {
                            localStorage.setItem('access_token', data.access);
                            return true;
                        } else {
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');
                            window.location.href = 'login.html';
                            return false;
                        }
                    })
                    .catch(error => {
                        console.error('Error refreshing token:', error);
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        window.location.href = 'login.html';
                        return false;
                    });
            }
        } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = 'login.html';
            return false;
        }
    }

    function updateNavLinks() {
        if (checkToken()) {
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (profileDropdown) profileDropdown.style.display = 'block';
        } else {
            if (loginLink) loginLink.style.display = 'block';
            if (registerLink) registerLink.style.display = 'block';
            if (profileDropdown) profileDropdown.style.display = 'none';
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('http://localhost:8000/account/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.token) {
                        localStorage.setItem('access_token', data.token.access);
                        localStorage.setItem('refresh_token', data.token.refresh);
                        window.location.href = 'index.html';
                    } else {
                        document.getElementById('login-error').innerText = data.error || 'Login failed';
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

            fetch('http://localhost:8000/account/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.token) {
                        localStorage.setItem('access_token', data.token.access);
                        localStorage.setItem('refresh_token', data.token.refresh);
                        window.location.href = 'login.html';
                    } else {
                        document.getElementById('register-error').innerText = data.error || 'Registration failed';
                    }
                })
                .catch(error => console.error('Error registering:', error));
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            const accessToken = localStorage.getItem('access_token');
            fetch('http://localhost:8000/account/logout/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh: localStorage.getItem('refresh_token')
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Logout failed');
                }
                return response.json();
            })
            .then(data => {
                localStorage.clear();
                window.location.href = 'login.html';
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
        });
    }

    updateNavLinks();
});
