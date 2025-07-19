document.addEventListener("DOMContentLoaded", function () {
    fetch('http://localhost:8000/account/profile/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        const profileInfo = document.getElementById('profile-info');
        if (profileInfo) {
            const profileImg = data.profile_image ? `http://localhost:8000${data.profile_image}` : 'https://via.placeholder.com/300';
            profileInfo.innerHTML = `
                <div class="card">
                    <img src="${profileImg}" alt="Profile Image" style="width:100%">
                    <h1>${data.name}</h1>
                    <p class="title">${data.email}</p>
                    <p>Bio: ${data.bio}</p>
                    <p>Date of Birth: ${data.dob}</p>
                </div>
            `;
        }
    })
    .catch(error => console.error('Error fetching profile:', error));
    const changePasswordButton = document.getElementById('change-password-btn');

    if (changePasswordButton) {
        changePasswordButton.addEventListener('click', function () {
            window.location.href = 'changepassword.html';
        });
    }
});
