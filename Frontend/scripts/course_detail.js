document.addEventListener("DOMContentLoaded", function () {
    const courseDetail = document.getElementById('course-detail');
    const videoList = document.getElementById('video-list');
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    fetch(`http://localhost:8000/courseshare/courses/${courseId}`)
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
            fetch(`http://localhost:8000/courseshare/courses/${courseId}/videos/`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(videos => {
                    videos.forEach((video, index) => {
                        const videoItem = document.createElement('li');
                        const buttonId = `video-btn-${index}`;
                        videoItem.innerHTML = `
                            <button id="${buttonId}" class="video-btn">${index}.${video.title}</button>
                            <iframe id="video-iframe-${index}" class="video-iframe" src="${video.video_url}" frameborder="0" allowfullscreen></iframe>
                            `;
                        if (video.is_preview) {
                            videoList.appendChild(videoItem);
                        }
                        const videoBtn = document.getElementById(buttonId);
                        const videoIframe = document.getElementById(`video-iframe-${index}`);

                        if (videoBtn && videoIframe) {
                            videoBtn.addEventListener('click', () => {
                                if (videoIframe.style.display === 'block') {
                                    videoIframe.style.display = 'none';
                                } else {
                                    videoIframe.style.display = 'block';
                                }
                            });
                        } else {
                            console.error('Button or iframe element not found.');
                        }
                    });
                })
                .catch(error => console.error('Error fetching videos:', error));
        })
        .catch(error => console.error('Error fetching course details:', error));
});

function enroll(courseId) {
    window.location.href = `checkout.html?courseId=${courseId}`;
}
