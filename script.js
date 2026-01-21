// ============================================
// Theme Toggle Functionality
// ============================================

const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Get theme from localStorage or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

// Theme toggle button click handler
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update navbar background on theme change
        updateNavbarBackground();
    });
}

// Function to update navbar background based on theme
function updateNavbarBackground() {
    const navbar = document.getElementById('navbar');
    const currentTheme = htmlElement.getAttribute('data-theme');
    const scrollY = window.scrollY;

    if (scrollY > 50) {
        if (currentTheme === 'light') {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
    } else {
        if (currentTheme === 'light') {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        }
        navbar.style.boxShadow = 'none';
    }
}

// ============================================
// Navigation Toggle (Mobile Menu)
// ============================================

const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ============================================
// Smooth Scrolling for Anchor Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Navbar Background on Scroll
// ============================================

const navbar = document.getElementById('navbar');

// Initialize navbar background on page load
updateNavbarBackground();

window.addEventListener('scroll', () => {
    updateNavbarBackground();
});

// ============================================
// Intersection Observer for Scroll Animations
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: Stop observing after animation to improve performance
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards for fade-in animation
const elementsToAnimate = document.querySelectorAll(
    '.about-content, .education-item, .skill-category, .timeline-item, .internship-card, .project-card, .beyond-work-card, .contact-links'
);

elementsToAnimate.forEach(element => {
    element.classList.add('fade-in');
    observer.observe(element);
});

// ============================================
// Active Navigation Link Highlighting
// ============================================

const sections = document.querySelectorAll('section[id]');

function highlightActiveSection() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// ============================================
// Add active class styling via CSS (optional enhancement)
// ============================================

// You can add this CSS rule if you want active nav links styled differently:
// .nav-link.active { color: var(--accent-blue); }


// ============================================
// Achievements Auto-scroll & Accessibility
// ============================================

/* Achievements: discover images in assets/achievements/ and render cards.
   Strategy (client-only):
   1. Try to fetch a manifest at assets/achievements/index.json (optional).
   2. If no manifest, fetch the directory URL and parse HTML index listing (works with simple static servers).
   3. Filter for common image extensions and render cards dynamically.
*/
(function initAchievements() {
    const scrollWrap = document.querySelector('.achievements-scroll');
    const grid = document.getElementById('achievements-grid');
    if (!scrollWrap || !grid) return;

    const ASSET_PATH = 'assets/achievements/';
    const MANIFEST = `${ASSET_PATH}index.json`;
    const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

    // Utility: generate a clean title from filename
    function titleFromFilename(filename) {
        // remove extension
        const name = filename.replace(/\.[^/.]+$/, '');
        // replace separators with space, remove digits that prefix names, collapse spaces
        const cleaned = name.replace(/[_-]+/g, ' ').replace(/^\d+\s*/, '').replace(/\s+/g, ' ').trim();
        // Title case
        return cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    // Utility: neutral professional description
    function neutralDescription(title) {
        return `Recognized for a notable professional achievement related to ${title}.`;
    }

    // Create and append a single card element
    // Accepts either an object { src, filename, title, desc } or values will be generated
    function createCard(item) {
        const src = item.src;
        const filename = item.filename || src.split('/').pop();
        const title = item.title || titleFromFilename(filename);
        const desc = item.description || item.desc || neutralDescription(title);

        const article = document.createElement('article');
        article.className = 'achievement-card fade-in';

        const img = document.createElement('img');
        img.className = 'achievement-img';
        img.src = src;
        img.alt = title;
        img.loading = 'lazy';

        const body = document.createElement('div');
        body.className = 'achievement-body';

        const h3 = document.createElement('h3');
        h3.className = 'achievement-title';
        h3.textContent = title;

        const p = document.createElement('p');
        p.className = 'achievement-desc';
        p.textContent = desc;

        body.appendChild(h3);
        body.appendChild(p);
        article.appendChild(img);
        article.appendChild(body);

        grid.appendChild(article);
        // Observe for entrance animation
        observer.observe(article);
    }

    // Try to parse HTML directory listing to find image links
    async function parseDirectoryListing(url) {
        try {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) return [];
            const text = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const anchors = Array.from(doc.querySelectorAll('a'));
            const candidates = anchors.map(a => a.getAttribute('href') || '').filter(Boolean);
            const images = candidates.filter(href => {
                const lower = href.toLowerCase();
                return IMAGE_EXTENSIONS.some(ext => lower.endsWith('.' + ext));
            }).map(href => {
                // normalize relative links
                if (/^(https?:)?\//i.test(href)) return href;
                return ASSET_PATH + href.replace(/^\.\//, '');
            });
            return images;
        } catch (e) {
            return [];
        }
    }

    // Try to get images via manifest first, then directory listing
    async function discoverImages() {
        // 1) Manifest (optional) — try multiple likely paths to be robust
        const manifestCandidates = [MANIFEST, `./${MANIFEST}`, `/${MANIFEST}`];
        for (const manifestUrl of manifestCandidates) {
            try {
                const man = await fetch(manifestUrl, { cache: 'no-store' });
                if (!man.ok) continue;
                let list;
                try {
                    list = await man.json();
                } catch (jsonErr) {
                    // if parsing fails, skip this manifest
                    console.debug('Achievements: failed to parse manifest JSON at', manifestUrl, jsonErr);
                    continue;
                }
                if (Array.isArray(list) && list.length) {
                    console.info('Achievements: using manifest at', manifestUrl);
                    return list.map(entry => {
                        if (typeof entry === 'string') {
                            return { src: ASSET_PATH + encodeURIComponent(entry), filename: entry };
                        }
                        if (entry && typeof entry === 'object') {
                            // support either {file:..., title:..., description:...} or {src:..., filename:..., title:...}
                            const file = entry.file || entry.filename || entry.src && entry.src.split('/').pop();
                            const src = entry.src ? entry.src : (file ? ASSET_PATH + encodeURIComponent(file) : null);
                            if (!src) return null;
                            return {
                                src,
                                filename: file,
                                title: entry.title,
                                description: entry.description
                            };
                        }
                        return null;
                    }).filter(Boolean);
                }
            } catch (e) {
                // ignore and try next candidate
            }
        }

        // 2) Directory listing parsing
        const dirImages = await parseDirectoryListing(ASSET_PATH);
        if (dirImages.length) return dirImages.map(src => ({ src, filename: src.split('/').pop() }));

        // 3) Fallback: use a client-side filename list (useful when directory
        // listings are disabled on the server). Update this list if you add
        // images manually to assets/achievements/.
        const FALLBACK_FILES = [
            'Bravo Individual Award.jpeg',
            'Bravo Team Award.jpeg',
            'High Five Award 2025.jpeg',
            'Microsoft AZ-900.png',
            'Rasa ChatBot Developer.png',
            'Top Talent 2024.jpeg',
            'Top Talent 2025.jpeg'
        ];

        return FALLBACK_FILES.map(name => ({ src: ASSET_PATH + encodeURIComponent(name), filename: name }));
    }

    // Render discovered images
    (async function render() {
        const images = await discoverImages();

        if (!images.length) {
            const note = document.createElement('p');
            note.className = 'achievement-desc';
            note.textContent = 'No achievement images found in assets/achievements/.';
            grid.appendChild(note);
            return;
        }

        // Clear any placeholders
        grid.innerHTML = '';

        images.forEach(item => {
            // item may be an object or string; normalize
            if (typeof item === 'string') {
                const filename = item.split('/').pop();
                createCard({ src: item, filename });
            } else if (item && typeof item === 'object') {
                createCard(item);
            }
        });
    })();


    // Auto-scroll horizontally (left-to-right) with pause on hover/focus
    let paused = false;
    const speed = 0.8; // pixels per animation frame (slightly faster horizontally)

    function step() {
        if (!scrollWrap) return;
        const maxScroll = grid.scrollWidth - scrollWrap.clientWidth;
        if (!paused && maxScroll > 0) {
            // advance scrollLeft, loop back to start when reaching the end
            if (scrollWrap.scrollLeft >= maxScroll - 1) {
                scrollWrap.scrollLeft = 0;
            } else {
                scrollWrap.scrollLeft = Math.min(scrollWrap.scrollLeft + speed, maxScroll);
            }
        }
        requestAnimationFrame(step);
    }

    scrollWrap.addEventListener('mouseenter', () => { paused = true; });
    scrollWrap.addEventListener('mouseleave', () => { paused = false; });
    scrollWrap.addEventListener('focusin', () => { paused = true; });
    scrollWrap.addEventListener('focusout', () => { paused = false; });

    // Ensure focusable container can be scrolled via keyboard and start loop
    scrollWrap.setAttribute('aria-live', 'polite');
    setTimeout(() => requestAnimationFrame(step), 600);

})();

// Hide broken or empty company logos and attach error handlers
(function tidyCompanyLogos() {
    const logos = document.querySelectorAll('.company-logo');
    logos.forEach(img => {
        // hide immediately if missing src or explicitly empty
        if (!img.getAttribute('src')) {
            img.style.display = 'none';
            return;
        }

        // if already failed to load (complete but zero width), hide
        if (img.complete && img.naturalWidth === 0) {
            img.style.display = 'none';
            return;
        }

        // hide on error
        img.addEventListener('error', () => {
            img.style.display = 'none';
        });
    });
})();

