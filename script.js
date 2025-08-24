// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.js-menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const menu = document.querySelector('.site-menu');
      if (menu) {
        menu.classList.toggle('d-block');
        menu.classList.toggle('mobile-menu');
      }
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        const menu = document.querySelector('.site-menu');
        if (menu && menu.classList.contains('mobile-menu')) {
          menu.classList.remove('d-block');
          menu.classList.remove('mobile-menu');
        }
        
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add animation on scroll
  function animateOnScroll() {
    const elements = document.querySelectorAll('.mission-card, .history-card, .feature-card, .activity-card');
    
    elements.forEach(element => {
      const position = element.getBoundingClientRect();
      
      // If element is in viewport
      if(position.top < window.innerHeight - 100) {
        element.style.opacity = 1;
        element.style.transform = 'translateY(0)';
      }
    });
  }
  
  // Initialize elements for animation
  const animatedElements = document.querySelectorAll('.mission-card, .history-card, .feature-card, .activity-card');
  animatedElements.forEach(element => {
    element.style.opacity = 0;
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  // Run on load and scroll
  window.addEventListener('load', animateOnScroll);
  window.addEventListener('scroll', animateOnScroll);
  
  // Initialize carousel with interval
  const myCarousel = document.querySelector('#hero-carousel');
  if (myCarousel) {
    const carousel = new bootstrap.Carousel(myCarousel, {
      interval: 5000,
      wrap: true
    });
  }
});

// Mobile menu toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

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

