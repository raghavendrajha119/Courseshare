document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');
    const token = localStorage.getItem('access_token');

    fetch(`http://localhost:8000/courseshare/course/${courseId}`)
        .then(response => response.json())
        .then(course => {
            document.getElementById('course-id').textContent = course.id;
            document.getElementById('course-name').textContent = course.Coursename;
            document.getElementById('course-price').textContent = course.Coursefee || 'Free';
        })
        .catch(error => console.error('Error fetching course details:', error));

    document.getElementById('payment-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        fetch(`http://localhost:8000/courseshare/course/${courseId}/enroll/`, {
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



    // // Stripe.js configuration and payment handling
    // const response = await fetch('/stripe/config/');
    // const config = await response.json();
    // const stripe = Stripe(config.publicKey);
    // const elements = stripe.elements();

    // const style = {
    //     base: {
    //         fontSize: '16px',
    //         fontFamily: '"Montserrat Alternates", sans-serif',
    //         color: '#32325d',
    //     },
    // };

    // const card = elements.create('card', { style });
    // card.mount('#card-element');

    // const form = document.getElementById('payment-form');

    // form.addEventListener('submit', async function (event) {
    //     event.preventDefault();
    //     const { token, error } = await stripe.createToken(card);

    //     if (error) {
    //         const errorElement = document.getElementById('card-errors');
    //         errorElement.textContent = error.message;
    //     } else {
    //         stripeTokenHandler(token);
    //     }
    // });

    // async function stripeTokenHandler(token) {
    //     const response = await fetch('/create-checkout-session/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ token: token.id }),
    //     });

    //     const session = await response.json();
    //     if (session.error) {
    //         console.error('Stripe session error:', session.error);
    //     } else {
    //         // Redirect to Stripe Checkout page
    //         stripe.redirectToCheckout({ sessionId: session.sessionId });
    //     }
    // }

