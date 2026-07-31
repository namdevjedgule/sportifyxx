async function loadComponent(url, mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    mount.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
    mount.innerHTML = `<p style="padding:16px;color:#FF6B00;">Could not load ${url}. Serve this site over http(s) (e.g. Live Server) instead of opening the file directly.</p>`;
  }
}

function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '/' && href === '/index.html')) {
      link.classList.add('active');
    }
  });
}

function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const header = document.querySelector('header');
  if (!toggle || !header) return;
  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('mobile-open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('mobile-open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => observer.observe(item));
}

function initStatCounters() {
  const cells = document.querySelectorAll('.stat-num[data-count]');
  if (!cells.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  cells.forEach(cell => observer.observe(cell));
}

const scoreboardData = {
  football: {
    title: 'Football Program',
    desc: 'Technical foundations, small-sided games, and match-intelligence training for age-grouped batches.',
    meta: ['U6–U19', '11v11 / 7v7', 'Wk-day + Wknd'],
    labels: ['Age Groups', 'Formats', 'Batches'],
  },
  cricket: {
    title: 'Cricket Program',
    desc: 'Batting technique, bowling mechanics, and match-reading, coached with nets and match-simulation drills.',
    meta: ['U8–U19', 'Hardball / Tennis', 'Wk-day + Wknd'],
    labels: ['Age Groups', 'Formats', 'Batches'],
  },
  badminton: {
    title: 'Badminton Program',
    desc: 'Footwork, racket control, and rally intelligence, building speed and precision from the very first rally.',
    meta: ['U8–U19', 'Singles / Doubles', 'Wk-day + Wknd'],
    labels: ['Age Groups', 'Formats', 'Batches'],
  },
};

function initScoreboardTabs() {
  const tabs = document.querySelectorAll('.scoreboard .tab');
  const panel = document.querySelector('.scoreboard-panel');
  if (!tabs.length || !panel) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const sport = tab.dataset.sport;
      const data = scoreboardData[sport];
      if (!data) return;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      panel.setAttribute('data-sport', sport);

      panel.querySelector('#sbTitle').textContent = data.title;
      panel.querySelector('#sbDesc').textContent = data.desc;
      panel.querySelector('#sbMeta1').textContent = data.meta[0];
      panel.querySelector('#sbMeta2').textContent = data.meta[1];
      panel.querySelector('#sbMeta3').textContent = data.meta[2];
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadComponent('/components/navbar.html', 'navbar'),
    loadComponent('/components/footer.html', 'footer'),
  ]);
  setActiveNavLink();
  initHeaderScroll();
  initNavToggle();
  initReveal();
  initStatCounters();
  initScoreboardTabs();
});