document.addEventListener("DOMContentLoaded", function() {
    const courseForm = document.getElementById('course-form');
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        window.location.href = 'login.html';
        return;
    }

    courseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(courseForm);

        fetch('http://localhost:8000/courseshare/course/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error adding course');
            }
            return response.json();
        })
        .then(data => {
            if (data.id) {
                window.location.href = 'index.html';
            } else {
                document.getElementById('course-error').innerText = data.error || 'Error adding course';
            }
        })
        .catch(error => {
            console.error('Error adding course:', error);
            document.getElementById('course-error').innerText = 'Error adding course';
        });
    });
});
