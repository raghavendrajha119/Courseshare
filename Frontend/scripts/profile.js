document.addEventListener("DOMContentLoaded", function() {
    const profileForm = document.getElementById('educator-profile-form');
    const coursesList = document.getElementById('courses-list');
    const accessToken = localStorage.getItem('access_token');

    if (profileForm) {
        // Fetch and display educator profile data
        fetch('http://localhost:8000/educator_profile/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').value = data.username;
            document.getElementById('email').value = data.email;
        });

        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;

            fetch('http://localhost:8000/educator_profile/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ username, email })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Profile updated successfully');
                } else {
                    document.getElementById('profile-error').innerText = data.error || 'Profile update failed';
                }
            })
            .catch(error => console.error('Error updating profile:', error));
        });
    }

    // Fetch and display educator's courses
    if (coursesList) {
        fetch('http://localhost:8000/courses/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(course => {
                const courseElement = document.createElement('div');
                courseElement.innerHTML = `
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <a href="course_update.html?id=${course.id}">Update Course</a>
                `;
                coursesList.appendChild(courseElement);
            });
        });
    }
});
