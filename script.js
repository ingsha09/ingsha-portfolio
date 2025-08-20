document.addEventListener("DOMContentLoaded", function() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('.section');
    const portfolioContainer = document.getElementById('portfolio-images');
    const contactForm = document.getElementById('contactForm');
    const messageContainer = document.getElementById('message-container');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const currentYearSpan = document.getElementById('current-year');

    currentYearSpan.textContent = new Date().getFullYear();

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle the mobile menu state
    function toggleMobileMenu() {
        navLinks.classList.toggle('active');
    }

    // Event listeners for both buttons
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Listen for clicks on the nav links to close the menu
    navLinks.addEventListener('click', (e) => {
        // Close the menu if a nav link or the new close button is clicked
        if (e.target.closest('a')) {
            toggleMobileMenu();
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    const username = 'ingsha09';
    const repo = 'ingsha-portfolio';
    const imagePath = 'thumbnail';
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${imagePath}`;
    const rawUrlPrefix = `https://raw.githubusercontent.com/${username}/${repo}/main/${imagePath}/`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch images from GitHub.');
            }
            return response.json();
        })
        .then(data => {
            const shuffledData = data.sort(() => 0.5 - Math.random());
            
            shuffledData.forEach(file => {
                if (file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                    const portfolioItem = document.createElement('div');
                    portfolioItem.className = 'portfolio-item';
                    portfolioItem.innerHTML = `
                        <img src="${rawUrlPrefix}${file.name}" alt="${file.name.split('.')[0].replace(/-/g, ' ')} thumbnail">
                        <div class="portfolio-overlay">
                            <h3>${file.name.split('.')[0].replace(/-/g, ' ')}</h3>
                            <p>YouTube Thumbnail Design</p>
                        </div>
                    `;
                    portfolioItem.querySelector('img').onclick = function() {
                        openLightbox(rawUrlPrefix + file.name);
                    };
                    portfolioContainer.appendChild(portfolioItem);
                }
            });
        })
        .catch(error => {
            console.error('Error loading portfolio images:', error);
            portfolioContainer.innerHTML = '<p style="color:red; grid-column: 1 / -1;">Failed to load images. Please check your GitHub repository settings.</p>';
        });

    function openLightbox(imageSrc) {
        lightboxImage.src = imageSrc;
        lightbox.style.display = 'flex';
    }

    window.closeLightbox = function() {
        lightbox.style.display = 'none';
    };

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const package = document.getElementById('package').value;
        const message = document.getElementById('message').value;

        const mailtoLink = `mailto:ingshalimbu09@gmail.com?subject=Inquiry from ${name} about ${package}&body=Name: ${name}%0AEmail: ${email}%0APackage: ${package}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
        
        try {
            window.location.href = mailtoLink;
            
            messageContainer.innerHTML = `<div class="message-container success-message">
                <i class="bx bxs-check-circle"></i> Thank you! Your message has been prepared in your email client.
            </div>`;
            messageContainer.style.display = 'block';

            contactForm.reset();
            
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 7000);
            
        } catch (error) {
            messageContainer.innerHTML = `<div class="message-container error-message">
                <i class="bx bxs-error-circle"></i> Oops! Something went wrong. Please copy this information and email me directly.
            </div>`;
            messageContainer.style.display = 'block';
            console.error('Error handling form submission:', error);
        }
    });
});
