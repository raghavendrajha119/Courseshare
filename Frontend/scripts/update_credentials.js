document.addEventListener("DOMContentLoaded", function () {
    const updateForm = document.getElementById('update-form');
    const updateError = document.getElementById('update-error');

    if (updateForm) {
        updateForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(updateForm);

            fetch('http://localhost:8000/account/update-profile/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: formData,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Profile update failed');
                }
                return response.json();
            })
            .then(data => {
                console.log('Profile updated successfully:', data);
                window.location.href = 'account.html';
            })
            .catch(error => {
                updateError.innerText = 'Failed to update profile. Please try again.';
                console.error('Error updating profile:', error);
            });
        });
    }
});
