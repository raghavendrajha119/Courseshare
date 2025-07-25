document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem('access_token');

    fetch('http://localhost:8000/courseshare/enrollments/', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(courses => {
        const courseList = document.getElementById('course-list');
        courses.forEach(course => {
            const courseCard = `
                <div class="course-detail">
                    <img src="${course.Thumbnail}" alt="${course.Coursename}">
                    <div class="course-detail-info">
                        <h2>${course.Coursename}</h2>
                        <p>${course.Details}</p>
                        <p>Language: ${course.Language}</p>
                        <p>Educator: ${course.EducatorName}</p>
                        <button class="enroll-btn" data-id="${course.id}">View Details</button>
                    </div>
                </div>
            `;
            courseList.insertAdjacentHTML('beforeend', courseCard);
            const enrollButtons = document.querySelectorAll('.enroll-btn');
            enrollButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const courseId = this.getAttribute('data-id');
                    window.location.href = `enrolledcourse_detail.html?id=${courseId}`;
                });
            });
        });
        
    })
    .catch(error => console.error('Error fetching enrolled courses:', error));
});
