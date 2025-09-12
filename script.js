 document.addEventListener('DOMContentLoaded', function() {
            // Mobile menu toggle functionality
            const menuToggle = document.querySelector('.js-menu-toggle');
            const mobileMenu = document.getElementById('mobileMenu');
            
            if (menuToggle && mobileMenu) {
                menuToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    mobileMenu.classList.toggle('active');
                });
            }
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (mobileMenu.classList.contains('active') && 
                    !e.target.closest('.mobile-menu') && 
                    !e.target.closest('.js-menu-toggle')) {
                    mobileMenu.classList.remove('active');
                }
            });
            
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Close mobile menu if open
                        if (mobileMenu.classList.contains('active')) {
                            mobileMenu.classList.remove('active');
                        }
                        
                        // Scroll to the target
                        window.scrollTo({
                            top: targetElement.offsetTop - 80, // Adjust for header height
                            behavior: 'smooth'
                        });
                    }
                });
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

