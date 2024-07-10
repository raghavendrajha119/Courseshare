document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch user profile data
    fetch('http://127.0.0.1:8000/account/profile/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('username').value = data.username;
        document.getElementById('email').value = data.email;
    })
    .catch(error => console.error('Error fetching profile:', error));

    // Update user profile data
    document.getElementById('account-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const newUsername = document.getElementById('new-username').value;
        const newEmail = document.getElementById('new-email').value;

        fetch('http://127.0.0.1:8000/account/profile/', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: newUsername,
                email: newEmail,
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 204) {
                return {}; // No content
            } else {
                throw new Error('Failed to update profile');
            }
        })
        .then(data => {
            if (data.username) {
                document.getElementById('username').value = data.username;
            }
            if (data.email) {
                document.getElementById('email').value = data.email;
            }
            alert('Profile updated successfully');
        })
        .catch(error => console.error('Error updating profile:', error));
    });
});
