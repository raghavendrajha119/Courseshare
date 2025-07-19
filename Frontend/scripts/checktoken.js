document.addEventListener("DOMContentLoaded", function () {
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
                            handleUnauthenticated();
                            return false;
                        }
                    })
                    .catch(error => {
                        console.error('Error refreshing token:', error);
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        handleUnauthenticated();
                        return false;
                    });
            }
        } else {
            handleUnauthenticated();
            return false;
        }
    }

    function updateNavLinks() {
        const loginLink = document.getElementById('login-link');
        const registerLink = document.getElementById('register-link');
        const profileDropdown = document.getElementById('profile-dropdown');

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

    function handleUnauthenticated() {
        if (window.location.pathname !== '/register.html') {
            window.location.href = 'login.html';
        }
    }

    updateNavLinks();
});
