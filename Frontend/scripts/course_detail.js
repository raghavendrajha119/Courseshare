document.addEventListener("DOMContentLoaded", function () {
    const courseDetail = document.getElementById('course-detail');
    const videoList = document.getElementById('video-list');
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    // Fetch course details
    fetch(`http://localhost:8000/courseshare/course/${courseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(course => {
            const thumbnailUrl = course.Thumbnail ? `http://localhost:8000${course.Thumbnail}` : 'https://via.placeholder.com/300';
            courseDetail.innerHTML = `
                <img src="${thumbnailUrl}" alt="Course Thumbnail">
                <div class="course-detail-info">
                    <h2>${course.Coursename}</h2>
                    <p><strong>Institute:</strong> ${course.Institutename}</p>
                    <p><strong>Details:</strong> ${course.Details}</p>
                    <p><strong>Language:</strong> ${course.Language}</p>
                    <p><strong>Fee:</strong> $${course.Coursefee || 'Free'}</p>
                    <p><strong>Duration:</strong> ${course.Duration}</p>
                    <p><strong>Educator:</strong> ${course.EducatorName}</p>
                    <button class="action enroll-btn" onclick="enroll(${course.id})">Enroll</button>
                </div>
            `;

            // Fetch videos for the course
            fetch(`http://localhost:8000/courseshare/course/${courseId}/videos/`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(videos => {
                    videos.forEach(video => {
                        const videoItem = document.createElement('li');
                        if (video.video_url.startsWith('http') || video.video_url.startsWith('https')) {
                            // Handle YouTube or external videos
                            videoItem.innerHTML = `
                                <h3>${video.title}</h3>
                                <iframe width="560" height="315" src="${video.video_url}" frameborder="0" allowfullscreen></iframe>
                            `;
                        } else {
                            // Assume local video
                            videoItem.innerHTML = `
                                <h3>${video.title}</h3>
                                <video width="560" height="315" controls>
                                    <source src="${video.video_url}" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                            `;
                        }
                        if (!video.is_preview) {
                            const enrollMessage = document.createElement('p');
                            enrollMessage.innerText = 'This video is available after enrolling in the course.';
                            videoItem.appendChild(enrollMessage);
                        }
                        videoList.appendChild(videoItem);
                    });
                })
                .catch(error => console.error('Error fetching videos:', error));
        })
        .catch(error => console.error('Error fetching course details:', error));
});

function enroll(courseId) {
    window.location.href = `checkout.html?courseId=${courseId}`;
}
