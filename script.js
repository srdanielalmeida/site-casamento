document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar scroll effect
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') 
                                ? '<i class="fas fa-times"></i>' 
                                : '<i class="fas fa-bars"></i>';
        });
    }

    // Close mobile menu when link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if(hamburger) {
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Intersection Observer for scroll animations (fade-in)
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

});

// Copy PIX function
function copyPix() {
    const pixKey = "casamento@danieleellen.com";
    navigator.clipboard.writeText(pixKey).then(() => {
        const btn = document.querySelector('#pix-card .btn');
        const originalText = btn.innerText;
        btn.innerText = "Copiado!";
        btn.style.backgroundColor = "var(--primary-color)";
        btn.style.color = "white";
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = "transparent";
            btn.style.color = "var(--primary-color)";
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}
