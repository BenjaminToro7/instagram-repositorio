document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const isInternal = ['home.html', 'search.html', 'reels.html', 'mensajes.html', 'perfil.html'].includes(page);

  // ─────────────────────────────────
  //  DARK MODE (global)
  // ─────────────────────────────────
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Dark mode toggle for ALL pages
  const darkBtn = document.createElement('button');
  darkBtn.className = 'dark-mode-toggle';
  darkBtn.id = 'darkModeToggle';
  darkBtn.setAttribute('aria-label', 'Alternar modo oscuro');
  darkBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  if (isInternal) darkBtn.style.bottom = '72px';
  darkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    darkBtn.textContent = isDark ? '☀️' : '🌙';
  });
  document.body.appendChild(darkBtn);

  // ─────────────────────────────────
  //  LOGIN (index.html)
  // ─────────────────────────────────
  if (!page || page === 'index.html') {
    const btn = document.querySelector('.btn-primary');
    if (btn && !btn.id) {
      const userEl = document.getElementById('usuario');
      const passEl = document.getElementById('password');
      const errEl = document.getElementById('error-msg');

      const doLogin = () => {
        const user = userEl?.value || '';
        const pass = passEl?.value || '';
        const savedUser = localStorage.getItem('usuario');
        const savedPass = localStorage.getItem('password');
        if (!user || !pass) {
          if (errEl) { errEl.textContent = 'Completa todos los campos'; errEl.style.display = 'block'; }
          return;
        }
        if (user === savedUser && pass === savedPass) {
          window.location.href = 'home.html';
        } else {
          if (errEl) { errEl.textContent = 'Usuario o contrase\u00f1a incorrectos'; errEl.style.display = 'block'; }
        }
      };
      btn.addEventListener('click', (e) => { e.preventDefault(); doLogin(); });
      [userEl, passEl].forEach(el => el?.addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); }));
    }
    window.togglePassword = () => {
      const el = document.getElementById('password');
      if (el) el.type = el.type === 'password' ? 'text' : 'password';
    };
    return;
  }

  // ─────────────────────────────────
  //  INTERNAL PAGES ONLY
  // ─────────────────────────────────
  if (!isInternal) return;

  // Loading screen
  const loader = document.createElement('div');
  loader.className = 'loading-screen';
  loader.innerHTML = '<div class="loader"></div>';
  document.body.prepend(loader);
  setTimeout(() => { loader.classList.add('fade-out'); setTimeout(() => loader.remove(), 400); }, 500);

  // Bottom navigation
  const navPages = [
    { id: 'home', label: 'Inicio', href: 'home.html' },
    { id: 'search', label: 'Buscar', href: 'search.html' },
    { id: 'reels', label: 'Reels', href: 'reels.html' },
    { id: 'mensajes', label: 'Mensajes', href: 'mensajes.html' },
    { id: 'perfil', label: 'Perfil', href: 'perfil.html' }
  ];
  const icons = {
    home: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    reels: '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="2" y="2" width="20" height="20" rx="4"/><line x1="8" y1="2" x2="8" y2="22"/><line x1="16" y1="2" x2="16" y2="22"/><line x1="2" y1="8" x2="22" y2="8"/><line x1="2" y1="16" x2="22" y2="16"/></svg>',
    mensajes: '<svg viewBox="0 0 24 24" width="24" height="24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    perfil: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  };

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  navPages.forEach(p => {
    const a = document.createElement('a');
    a.href = p.href;
    a.className = 'nav-item' + (p.href === page ? ' active' : '');
    a.innerHTML = icons[p.id] + '<span>' + p.label + '</span>';
    nav.appendChild(a);
  });
  document.body.appendChild(nav);

  // ─────────────────────────────────
  //  POST INTERACTIONS
  // ─────────────────────────────────
  document.querySelectorAll('.post').forEach((post, i) => {
    if (!post.dataset.postId) post.dataset.postId = 'feed_' + i;
  });

  const savedLikes = JSON.parse(localStorage.getItem('likedPosts') || '{}');

  document.querySelectorAll('.post-actions-left svg:first-child').forEach(heart => {
    const post = heart.closest('.post');
    if (post && savedLikes[post.dataset.postId]) {
      heart.classList.add('liked');
      heart.style.fill = '#ed4956';
      heart.style.stroke = '#ed4956';
    }
    heart.addEventListener('click', function (e) {
      e.stopPropagation();
      const p = this.closest('.post');
      if (!p) return;
      const likesEl = p.querySelector('.post-likes');
      if (!likesEl) return;
      this.classList.toggle('liked');
      const liked = this.classList.contains('liked');
      let count = parseInt(likesEl.textContent) || 0;
      if (liked) {
        count++;
        this.style.fill = '#ed4956';
        this.style.stroke = '#ed4956';
        this.style.animation = 'heartPop .3s ease';
      } else {
        count--;
        this.style.fill = 'none';
        this.style.stroke = '';
        this.style.animation = '';
      }
      likesEl.textContent = count + ' likes';
      const s = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      s[p.dataset.postId] = liked;
      localStorage.setItem('likedPosts', JSON.stringify(s));
      setTimeout(() => { this.style.animation = ''; }, 300);
    });
  });

  // Comment toggle
  document.querySelectorAll('.post-actions-left svg:nth-child(2)').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const post = this.closest('.post');
      if (!post) return;
      let section = post.querySelector('.comment-section');
      if (section) { section.remove(); return; }
      section = document.createElement('div');
      section.className = 'comment-section';
      section.innerHTML = '<div class="comment-input-wrapper"><input type="text" class="comment-input" placeholder="Agrega un comentario\u2026"><button class="comment-submit">Publicar</button></div>';
      post.querySelector('.post-caption')?.after(section);
      const input = section.querySelector('.comment-input');
      const submit = section.querySelector('.comment-submit');
      const add = () => {
        const t = input.value.trim();
        if (!t) return;
        const d = document.createElement('div');
        d.className = 'comment-item';
        d.innerHTML = '<strong>' + (localStorage.getItem('usuario') || 'usuario') + '</strong> ' + t.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        section.insertBefore(d, section.querySelector('.comment-input-wrapper'));
        input.value = '';
      };
      submit.addEventListener('click', add);
      input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') add(); });
      input.focus();
    });
  });

  // Save toggle
  document.querySelectorAll('.post-actions > svg:last-child').forEach(svg => {
    svg.addEventListener('click', function (e) {
      e.stopPropagation();
      this.classList.toggle('saved');
      const s = this.classList.contains('saved');
      this.style.fill = s ? 'var(--text-primary)' : 'none';
      this.style.stroke = s ? 'var(--text-primary)' : '';
    });
  });

  // ─────────────────────────────────
  //  SEARCH
  // ─────────────────────────────────
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    const suggestions = document.querySelectorAll('.search-suggestion');
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      suggestions.forEach(s => {
        const name = s.querySelector('strong')?.textContent.toLowerCase() || '';
        s.style.display = name.includes(q) ? 'flex' : 'none';
      });
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        suggestions.forEach(s => s.style.display = 'flex');
        searchInput.blur();
      }
    });
  }
});
