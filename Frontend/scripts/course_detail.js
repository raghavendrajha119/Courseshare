document.addEventListener("DOMContentLoaded", function() {
    const courseDetail = document.getElementById('course-detail');
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    fetch(`http://localhost:8000/courseshare/course/${courseId}`)
        .then(response => response.json())
        .then(course => {
            const thumbnailUrl = course.Thumbnail.startsWith('/media') ? `http://localhost:8000${course.Thumbnail}` : 'https://via.placeholder.com/300';
            courseDetail.innerHTML = `
                <img src="${thumbnailUrl}" alt="Course Thumbnail">
                <h2>${course.Coursename}</h2>
                <p><strong>Institute:</strong> ${course.Institutename}</p>
                <p><strong>Details:</strong> ${course.Details}</p>
                <p><strong>Language:</strong> ${course.Language}</p>
                <p><strong>Fee:</strong> $${course.Coursefee || 'Free'}</p>
                <p><strong>Duration:</strong> ${course.Duration}</p>
                <p><strong>Educator:</strong> ${course.EducatorName}</p>
                <button class="enroll-btn" onclick="enroll(${course.id})">Enroll</button>
            `;
        })
        .catch(error => console.error('Error fetching course details:', error));
});

function enroll(courseId) {
    window.location.href = `checkout.html?courseId=${courseId}`;
}
