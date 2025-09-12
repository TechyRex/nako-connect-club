 document.addEventListener('DOMContentLoaded', function() {
      // Mobile menu toggle - Fixed version
      const menuToggle = document.querySelector('.js-menu-toggle');
      if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
          e.preventDefault();
          const menu = document.querySelector('.site-menu');
          if (menu) {
            menu.classList.toggle('mobile-open');
          }
        });
      }
      
      // Close menu when clicking on a link (mobile)
      document.querySelectorAll('.site-menu a').forEach(link => {
        link.addEventListener('click', function() {
          const menu = document.querySelector('.site-menu');
          if (window.innerWidth < 992 && menu) {
            menu.classList.remove('mobile-open');
          }
        });
      });
      
      // Smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          if (this.hash !== "") {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              // Close mobile menu if open
              const menu = document.querySelector('.site-menu');
              if (menu && menu.classList.contains('mobile-open')) {
                menu.classList.remove('mobile-open');
              }
              
              targetElement.scrollIntoView({
                behavior: 'smooth'
              });
            }
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

