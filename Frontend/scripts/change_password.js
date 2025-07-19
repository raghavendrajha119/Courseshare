document.addEventListener("DOMContentLoaded", function () {
    const changePasswordForm = document.getElementById('change-password-form');

    changePasswordForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate if passwords match
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // API call to change password
        fetch('http://localhost:8000/account/changepassword/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: newPassword,
                password2: confirmPassword,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to change password.');
            }
            return response.json();
        })
        .then(data => {
            alert(data.msg); // Show success message
            changePasswordForm.reset(); // Clear form fields
        })
        .catch(error => {
            console.error('Error changing password:', error);
            alert('Failed to change password. Please try again.');
        });
    });
});
