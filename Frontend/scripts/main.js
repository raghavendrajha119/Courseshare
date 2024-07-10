document.addEventListener("DOMContentLoaded", function() {
    const courseList = document.getElementById('course-list');

    fetch('http://localhost:8000/courseshare/course/')
        .then(response => response.json())
        .then(courses => {
            courseList.innerHTML = courses.map(course => `
                <div class="course-card" data-id="${course.id}">
                    <div class="course-thumbnail" style="background-image: url(${course.Thumbnail.startsWith('/media') ? `http://localhost:8000${course.Thumbnail}` : 'https://via.placeholder.com/300'})"></div>
                    <div class="course-info">
                        <h2>${course.Coursename}</h2>
                        <p><strong>Institute:</strong> ${course.Institutename}</p>
                        <p><strong>Details:</strong> ${course.Details}</p>
                        <p><strong>Language:</strong> ${course.Language}</p>
                    </div>
                    <div class="course-meta">
                        <div><strong>Fee:</strong> $${course.Coursefee || 'Free'}</div>
                        <div><strong>Duration:</strong> ${course.Duration}</div>
                    </div>
                    <button class="enroll-btn" onclick="enroll(${course.id})">Enroll</button>
                </div>
            `).join('');

            const courseCards = document.querySelectorAll('.course-card');
            courseCards.forEach(card => {
                card.addEventListener('click', function() {
                    const courseId = this.getAttribute('data-id');
                    window.location.href = `course_detail.html?id=${courseId}`;
                });
            });
        })
        .catch(error => console.error('Error fetching courses:', error));
});

function enroll(courseId) {
    window.location.href = `checkout.html?courseId=${courseId}`;
}
