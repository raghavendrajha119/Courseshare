document.addEventListener("DOMContentLoaded", function() {
    const videoForm = document.getElementById('video-form');
    const accessToken = localStorage.getItem('access_token');
    const queryParams = new URLSearchParams(window.location.search);
    const courseId = queryParams.get('course_id'); // Assuming you pass course_id as a query parameter

    if (!accessToken) {
        window.location.href = 'login.html';
        return;
    }

    // Function to add new video input fields
    function addVideoField() {
        const videosContainer = document.getElementById('videos-container');
        const videoEntry = document.createElement('div');
        videoEntry.classList.add('video-entry');
        videoEntry.innerHTML = `
            <label for="videoTitle">Video Title:</label>
            <input type="text" class="video-title" name="videoTitle" required>
            <label for="videoUrl">Video URL:</label>
            <input type="url" class="video-url" name="videoUrl" required>
            <label for="isPreview">Preview Video:</label>
            <input type="checkbox" class="is-preview" name="isPreview">
        `;
        videosContainer.appendChild(videoEntry);
    }

    const addVideoBtn = document.getElementById('add-video-btn');
    addVideoBtn.addEventListener('click', addVideoField);
    videoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Gather all video input fields
        const videoTitleInputs = document.querySelectorAll('.video-title');
        const videoUrlInputs = document.querySelectorAll('.video-url');
        const isPreviewCheckboxes = document.querySelectorAll('.is-preview');

        // Prepare videos array
        const videos = [];
        videoTitleInputs.forEach((titleInput, index) => {
            const video = {
                title: titleInput.value.trim(),
                video_url: videoUrlInputs[index].value.trim(),
                is_preview: isPreviewCheckboxes[index].checked,
            };
            videos.push(video);
        });
        fetch(`http://localhost:8000/courseshare/course/${courseId}/videos/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(videos),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error adding videos');
            }
            return response.json();
        })
        .then(data => {
            console.log('Videos added successfully:', data);
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Error adding videos:', error);
            document.getElementById('video-error').innerText = 'Error adding videos';
        });
    });
});
