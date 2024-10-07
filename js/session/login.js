document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(loginForm);
        console.log('Form data:', formData);
        const data = Object.fromEntries(new FormData(loginForm).entries());
        console.log('Data:', data);

        fetch('./controller/login/logUser.php', {
            method: 'POST',
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            if (data.success) {
                // Handle successful login
                console.log('Login successful');
            window.location.href = './index.php';
            } else {
                // Handle login failure
                console.log('Login failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});