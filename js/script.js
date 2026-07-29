document.addEventListener("DOMContentLoaded", () => {

    const depth = window.location.pathname
        .split("/")
        .filter(Boolean)
        .length;

    const prefix = depth > 0
        ? "../".repeat(depth)
        : "./";

    loadNavbar(prefix);
    loadFooter(prefix);

});


function loadNavbar(prefix) {

    const navbar = document.getElementById("navbar");

    if (!navbar) return;

    fetch(`${prefix}components/navbar.html`)

        .then(response => {

            if (!response.ok) {

                throw new Error("Unable to load navbar.");

            }

            return response.text();

        })

        .then(html => {

            navbar.innerHTML = html.trim();

            requestAnimationFrame(() => {

                initNavbar();

            });

        })

        .catch(error => {

            console.error("Navbar:", error);

        });

}

function loadFooter(prefix) {

    const footer = document.getElementById("footer");

    if (!footer) return;

    fetch(prefix + "components/footer.html")

        .then(response => {

            if (!response.ok) {

                throw new Error("Unable to load footer.");

            }

            return response.text();

        })

        .then(html => {

           footer.innerHTML = html.trim();

        })

        .catch(error => {

            console.error("Footer:", error);

        });

}

function initNavbar() {

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");
    const siteHeader = document.getElementById("siteHeader");

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("show");

        menuBtn.classList.toggle("active");

    });

    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("show");

            menuBtn.classList.remove("active");

        });

    });

    window.addEventListener("scroll", () => {

        siteHeader.classList.toggle("scrolled", window.scrollY > 30);

    });

    const currentPath = window.location.pathname;

    navLinks.querySelectorAll("a").forEach(link => {
        let href = link.getAttribute("href");
        if (href === "/") {
            if (
                currentPath === "/" ||
                currentPath.endsWith("/index.html")
            ) {
                link.classList.add("active");
            }
        } else if (currentPath.includes(href)) {
            link.classList.add("active");
        }
    });

}

const sportData = {
    football: {
        title: 'Football Program',
        desc: 'Technical foundations, small-sided games, and match-intelligence training for age-grouped batches.',
        meta: ['U6–U19', '11v11 / 7v7', 'Wk-day + Wknd']
    },
    cricket: {
        title: 'Cricket Program',
        desc: 'Batting, bowling, and fielding fundamentals with structured net sessions and match simulations.',
        meta: ['U8–U19', 'Hardball / Tennis', 'Wk-day + Wknd']
    },
    badminton: {
        title: 'Badminton Program',
        desc: 'Footwork drills, stroke technique, and rally-building sessions for singles and doubles play.',
        meta: ['U8–U19', 'Singles / Doubles', 'Wk-day + Wknd']
    }
};

const tabs = document.querySelectorAll('.tab');
const panel = document.querySelector('.scoreboard-panel');
const sbTitle = document.getElementById('sbTitle');
const sbDesc = document.getElementById('sbDesc');
const sbMeta = [document.getElementById('sbMeta1'), document.getElementById('sbMeta2'), document.getElementById('sbMeta3')];

if (panel) panel.style.transition = 'opacity .2s ease';

if (tabs.length && panel) {
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const sport = tab.dataset.sport;
            const data = sportData[sport];
            panel.dataset.sport = sport;
            panel.style.opacity = 0;
            setTimeout(() => {
                sbTitle.textContent = data.title;
                sbDesc.textContent = data.desc;
                sbMeta.forEach((el, i) => {
                    if (el) el.textContent = data.meta[i];
                });
                panel.style.opacity = 1;
            }, 150);
        });
    });
}

const statEls = document.querySelectorAll('[data-count]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            if (reduceMotion) {
                el.textContent = target + suffix;
            } else {
                let current = 0;
                const step = Math.max(1, Math.ceil(target / 40));
                const tick = () => {
                    current += step;
                    if (current >= target) {
                        el.textContent = target + suffix;
                    } else {
                        el.textContent = current + suffix;
                        requestAnimationFrame(tick);
                    }
                };
                requestAnimationFrame(tick);
            }
            countObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
if (statEls.length) {

    statEls.forEach(el => {

        countObserver.observe(el);

    });

}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {

    revealItems.forEach(el => {

        revealObserver.observe(el);

    });

}
