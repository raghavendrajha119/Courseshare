document.addEventListener("DOMContentLoaded", function() {
    const courseList = document.getElementById('course-list');
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        window.location.href = 'login.html';
        return;
    }

    fetch('http://localhost:8000/courseshare/courses/my/', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }
        return response.json();
    })
    .then(courses => {
        console.log(courses); // Debugging: log the courses

        courseList.innerHTML = courses.map(course => {
            const thumbnailURL = course.Thumbnail.startsWith('/media') ? `http://localhost:8000${course.Thumbnail}` : 'https://via.placeholder.com/300';
            console.log(`Course ID: ${course.id}, Thumbnail URL: ${thumbnailURL}`); // Debugging: log the thumbnail URL

            return `
            <div class="course-card" data-id="${course.id}">
                <div class="course-thumbnail" style="background-image: url(${thumbnailURL})"></div>
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
            `;
        }).join('');

        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            card.addEventListener('click', function() {
                const courseId = this.getAttribute('data-id');
                window.location.href = `course_detail.html?id=${courseId}`;
            });
        });
    })
    .catch(error => console.error('Error fetching courses:', error));
     const addCourseBtn = document.getElementById('add-course-btn');
     addCourseBtn.addEventListener('click', function() {
         window.location.href = 'course_add.html';
     });
});

function enroll(courseId) {
    window.location.href = `checkout.html?courseId=${courseId}`;
}
