document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');
    const token = localStorage.getItem('access_token');

    fetch(`http://localhost:8000/courseshare/courses/${courseId}`)
        .then(response => response.json())
        .then(course => {
            document.getElementById('course-id').textContent = course.id;
            document.getElementById('course-name').textContent = course.Coursename;
            document.getElementById('course-price').textContent = course.Coursefee || 'Free';
        })
        .catch(error => console.error('Error fetching course details:', error));

    document.getElementById('payment-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        fetch(`http://localhost:8000/courseshare/enroll/${courseId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'enrolled') {
                alert('Course enrolled successfully');
                window.location.href = 'enrolled_courses.html';
            }
        })
        .catch(error => console.error('Error enrolling in course:', error));
    });
});
