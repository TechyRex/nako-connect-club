// script.js for NCC mobile navigation
document.addEventListener('DOMContentLoaded', function() {
    // Select the menu toggle button
    const menuToggle = document.querySelector('.js-menu-toggle');
    const siteNavbar = document.querySelector('.site-navbar');
    const siteMenu = document.querySelector('.site-menu');
    
    // Create a function to toggle the menu
    function toggleMenu() {
        const isMenuVisible = siteMenu.style.display === 'block';
        
        if (isMenuVisible) {
            siteMenu.style.display = 'none';
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        } else {
            siteMenu.style.display = 'block';
            menuToggle.querySelector('i').classList.remove('fa-bars');
            menuToggle.querySelector('i').classList.add('fa-times');
        }
    }
    
    // Add click event to the toggle button
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu();
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!siteNavbar.contains(e.target) && siteMenu.style.display === 'block') {
            toggleMenu();
        }
    });
    
    // Close menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992 && siteMenu.style.display === 'block') {
            siteMenu.style.display = 'none';
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        }
    });
});
// Form submission handling for registration
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(registrationForm);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send this data to SheetDB
            // For now, we'll just show a success message
            alert('Registration submitted successfully! We will contact you soon.');
            registrationForm.reset();
            
            // Example of how to send to SheetDB (replace with your actual endpoint)
            /*
            fetch('https://sheetdb.io/api/v1/your-sheet-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data: data})
            })
            .then(response => response.json())
            .then(data => {
                alert('Registration submitted successfully!');
                registrationForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error with your submission. Please try again.');
            });
            */
        });
    }
});

// Simple image gallery functionality
let currentIndex = 0;
const images = document.querySelectorAll('.gallery-image');
const totalImages = images.length;

function showNextImage() {
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % totalImages;
    images[currentIndex].classList.add('active');
}

// Auto-rotate gallery images if on gallery page
if (document.querySelector('.gallery-container')) {
    setInterval(showNextImage, 5000);
}

