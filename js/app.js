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
      const icon = document.getElementById('toggleIcon');
      if (!el) return;
      const showing = el.type === 'text';
      el.type = showing ? 'password' : 'text';
      if (icon) icon.src = showing ? 'images/mirar.png' : 'images/nomirar.png';
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
  //  POST INTERACTIONS (persistent)
  // ─────────────────────────────────
  document.querySelectorAll('.post').forEach((post, i) => {
    if (!post.dataset.postId) post.dataset.postId = 'feed_' + i;
  });

  const savedLikes = JSON.parse(localStorage.getItem('likedPosts') || '{}');
  const savedCounts = JSON.parse(localStorage.getItem('postLikes') || '{}');
  const savedSaves = JSON.parse(localStorage.getItem('savedPosts') || '{}');

  // Restore saved like counts
  document.querySelectorAll('.post').forEach(post => {
    const id = post.dataset.postId;
    if (savedCounts[id] !== undefined) {
      const el = post.querySelector('.post-likes');
      if (el) el.textContent = savedCounts[id] + ' likes';
    }
  });

  // Restore saved bookmark state
  document.querySelectorAll('.post-actions > svg:last-child').forEach(svg => {
    const post = svg.closest('.post');
    if (post && savedSaves[post.dataset.postId]) {
      svg.classList.add('saved');
      svg.style.fill = 'var(--text-primary)';
      svg.style.stroke = 'var(--text-primary)';
    }
  });

  // Like / unlike
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
      const c = JSON.parse(localStorage.getItem('postLikes') || '{}');
      s[p.dataset.postId] = liked;
      c[p.dataset.postId] = count;
      localStorage.setItem('likedPosts', JSON.stringify(s));
      localStorage.setItem('postLikes', JSON.stringify(c));
      setTimeout(() => { this.style.animation = ''; }, 300);
    });
  });

  // Comment toggle (persistent)
  document.querySelectorAll('.post-actions-left svg:nth-child(2)').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const post = this.closest('.post');
      if (!post) return;
      const postId = post.dataset.postId;
      let section = post.querySelector('.comment-section');
      if (section) { section.remove(); return; }
      section = document.createElement('div');
      section.className = 'comment-section';
      section.innerHTML = '<div class="comment-input-wrapper"><input type="text" class="comment-input" placeholder="Agrega un comentario\u2026"><button class="comment-submit">Publicar</button></div>';
      post.querySelector('.post-caption')?.after(section);

      // Load saved comments
      const saved = JSON.parse(localStorage.getItem('comments_' + postId) || '[]');
      saved.forEach(c => {
        const d = document.createElement('div');
        d.className = 'comment-item';
        d.innerHTML = '<strong>' + c.user.replace(/</g, '&lt;') + '</strong> ' + c.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        section.insertBefore(d, section.querySelector('.comment-input-wrapper'));
      });

      const input = section.querySelector('.comment-input');
      const submit = section.querySelector('.comment-submit');
      const add = () => {
        const t = input.value.trim();
        if (!t) return;
        const user = localStorage.getItem('usuario') || 'usuario';
        const d = document.createElement('div');
        d.className = 'comment-item';
        d.innerHTML = '<strong>' + user.replace(/</g, '&lt;') + '</strong> ' + t.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        section.insertBefore(d, section.querySelector('.comment-input-wrapper'));
        input.value = '';
        // Persist
        const comments = JSON.parse(localStorage.getItem('comments_' + postId) || '[]');
        comments.push({ user, text: t, timestamp: Date.now() });
        localStorage.setItem('comments_' + postId, JSON.stringify(comments));
      };
      submit.addEventListener('click', add);
      input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') add(); });
      input.focus();
    });
  });

  // Save / bookmark toggle (persistent)
  document.querySelectorAll('.post-actions > svg:last-child').forEach(svg => {
    svg.addEventListener('click', function (e) {
      e.stopPropagation();
      this.classList.toggle('saved');
      const s = this.classList.contains('saved');
      this.style.fill = s ? 'var(--text-primary)' : 'none';
      this.style.stroke = s ? 'var(--text-primary)' : '';
      const p = this.closest('.post');
      if (p) {
        const saves = JSON.parse(localStorage.getItem('savedPosts') || '{}');
        saves[p.dataset.postId] = s;
        localStorage.setItem('savedPosts', JSON.stringify(saves));
      }
    });
  });

  // Double-tap to like on post image
  function showFloatingHeart(container) {
    const existing = container.querySelector('.floating-heart');
    if (existing) existing.remove();
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '\u2764';
    heart.style.cssText = 'position:absolute;top:50%;left:50%;font-size:90px;color:#ed4956;transform:translate(-50%,-50%) scale(0);pointer-events:none;z-index:5;line-height:1;';
    if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
    container.appendChild(heart);
    requestAnimationFrame(() => {
      heart.style.transition = 'transform 0.3s cubic-bezier(0,0,0.2,1), opacity 0.35s ease';
      heart.style.transform = 'translate(-50%,-50%) scale(1)';
      heart.style.opacity = '1';
    });
    setTimeout(() => {
      heart.style.opacity = '0';
      heart.style.transform = 'translate(-50%,-50%) scale(1.4)';
      setTimeout(() => heart.remove(), 400);
    }, 400);
  }

  document.querySelectorAll('.post-image').forEach(img => {
    img.addEventListener('dblclick', function (e) {
      const post = this.closest('.post');
      if (!post) return;
      const heart = post.querySelector('.post-actions-left svg:first-child');
      if (!heart) return;
      if (!heart.classList.contains('liked')) {
        heart.click();
      }
      showFloatingHeart(this);
    });
  });

  // ─────────────────────────────────
  //  REEL INTERACTIONS
  // ─────────────────────────────────
  document.querySelectorAll('.reel[data-post-id]').forEach(reel => {
    const id = reel.dataset.postId;
    const savedLikes = JSON.parse(localStorage.getItem('likedPosts') || '{}');
    const savedSaves = JSON.parse(localStorage.getItem('savedPosts') || '{}');

    // Restore state
    const likeSvg = reel.querySelector('.reel-like');
    if (likeSvg && savedLikes[id]) {
      likeSvg.classList.add('liked');
      likeSvg.style.fill = '#ed4956';
      likeSvg.style.stroke = '#ed4956';
    }
    const saveSvg = reel.querySelector('.reel-save');
    if (saveSvg && savedSaves[id]) {
      saveSvg.classList.add('saved');
      saveSvg.style.fill = '#fff';
      saveSvg.style.stroke = '#fff';
    }

    // Like toggle
    if (likeSvg) {
      likeSvg.addEventListener('click', function (e) {
        e.stopPropagation();
        this.classList.toggle('liked');
        const liked = this.classList.contains('liked');
        this.style.fill = liked ? '#ed4956' : 'none';
        this.style.stroke = liked ? '#ed4956' : '';
        const countEl = this.closest('.reel-action')?.querySelector('.reel-action-count');
        if (countEl && liked) {
          const raw = countEl.textContent.replace(/[^0-9.]/g, '');
          const num = parseFloat(raw) || 0;
          countEl.textContent = (num + 1) + (raw.includes('K') ? 'K' : '');
        } else if (countEl) {
          const raw = countEl.textContent.replace(/[^0-9.]/g, '');
          const num = parseFloat(raw) || 0;
          countEl.textContent = Math.max(0, num - 1) + (raw.includes('K') ? 'K' : '');
        }
        const s = JSON.parse(localStorage.getItem('likedPosts') || '{}');
        s[id] = liked;
        localStorage.setItem('likedPosts', JSON.stringify(s));
      });
    }

    // Save toggle
    if (saveSvg) {
      saveSvg.addEventListener('click', function (e) {
        e.stopPropagation();
        this.classList.toggle('saved');
        const s = this.classList.contains('saved');
        this.style.fill = s ? '#fff' : 'none';
        this.style.stroke = s ? '#fff' : '';
        const saves = JSON.parse(localStorage.getItem('savedPosts') || '{}');
        saves[id] = s;
        localStorage.setItem('savedPosts', JSON.stringify(saves));
      });
    }

    // Comment toggle
    const commentSvg = reel.querySelector('.reel-comment');
    if (commentSvg) {
      commentSvg.addEventListener('click', function (e) {
        e.stopPropagation();
        const text = prompt('Escribe un comentario para ' + id + ':');
        if (text && text.trim()) {
          const comments = JSON.parse(localStorage.getItem('comments_' + id) || '[]');
          comments.push({ user: localStorage.getItem('usuario') || 'usuario', text: text.trim(), timestamp: Date.now() });
          localStorage.setItem('comments_' + id, JSON.stringify(comments));
          const countEl = this.closest('.reel-action')?.querySelector('.reel-action-count');
          if (countEl) {
            const raw = parseInt(countEl.textContent) || 0;
            countEl.textContent = (raw + 1);
          }
        }
      });
    }
  });

  // ─────────────────────────────────
  //  STORY VIEWER
  // ─────────────────────────────────

  const storyData = {
    viajante_: {
      stories: [
        { emoji: '\uD83C\uDF05', text: 'Atardecer en la playa', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
        { emoji: '\uD83C\uDF0A', text: 'El mar nunca falla', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' }
      ],
      avatar: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'%3E%3Ccircle cx=\'16\' cy=\'16\' r=\'16\' fill=\'%23f5576c\'/%3E%3C/svg%3E'
    },
    foto_urbana: {
      stories: [
        { emoji: '\uD83C\uDF03', text: 'Luces de la ciudad', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
        { emoji: '\uD83C\uDFA8', text: 'Arte en cada esquina', gradient: 'linear-gradient(135deg, #f093fb, #4facfe)' }
      ],
      avatar: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'%3E%3Ccircle cx=\'16\' cy=\'16\' r=\'16\' fill=\'%23764ba2\'/%3E%3C/svg%3E'
    },
    cafe_arte: {
      stories: [
        { emoji: '\u2615', text: 'Ma\u00F1ana de espresso', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
        { emoji: '\uD83C\uDF6A', text: 'Dulce tentaci\u00F3n', gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)' }
      ],
      avatar: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'%3E%3Ccircle cx=\'16\' cy=\'16\' r=\'16\' fill=\'%23fbc2eb\'/%3E%3C/svg%3E'
    },
    naturaleza: {
      stories: [
        { emoji: '\uD83C\uDF33', text: 'Bosque encantado', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)' },
        { emoji: '\uD83C\uDF1F', text: 'Noche estrellada', gradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }
      ],
      avatar: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'%3E%3Ccircle cx=\'16\' cy=\'16\' r=\'16\' fill=\'%2338ef7d\'/%3E%3C/svg%3E'
    }
  };

  let viewerState = null;

  function markStorySeen(userId) {
    document.querySelectorAll('.story[data-story-id="' + userId + '"] .story-avatar').forEach(el => el.classList.add('seen'));
  }

  function openStoryViewer(userId) {
    if (userId === 'tu_historia') {
      alert('Agrega tu historia tocando el bot\u00F3n "+"');
      return;
    }

    markStorySeen(userId);
    const data = storyData[userId];
    if (!data) return;

    const allIds = Object.keys(storyData);

    viewerState = {
      userIds: allIds,
      currentUserIdx: allIds.indexOf(userId),
      currentStoryIdx: 0,
      timer: null,
      elapsed: 0,
      interval: null
    };

    renderStoryViewer();
  }

  function renderStoryViewer() {
    const s = viewerState;
    const userId = s.userIds[s.currentUserIdx];
    const data = storyData[userId];
    const story = data.stories[s.currentStoryIdx];

    // Flat list of all stories across all users
    const allUserIds = [];
    const allStoryIndices = [];
    s.userIds.forEach(id => {
      storyData[id].stories.forEach((_, si) => {
        allUserIds.push(id);
        allStoryIndices.push(si);
      });
    });

    let flatIdx = 0;
    for (let i = 0; i < s.currentUserIdx; i++) { flatIdx += storyData[s.userIds[i]].stories.length; }
    flatIdx += s.currentStoryIdx;

    const viewer = document.createElement('div');
    viewer.className = 'story-viewer';
    viewer.id = 'storyViewer';

    // Progress bars
    let progressHTML = '<div class="story-progress">';
    allUserIds.forEach((uid, i) => {
      const cls = i < flatIdx ? 'done' : i === flatIdx ? 'active' : '';
      progressHTML += '<div class="story-progress-bar ' + cls + '"><div class="fill"></div></div>';
    });
    progressHTML += '</div>';

    viewer.innerHTML = progressHTML +
      '<div class="story-gradient"></div>' +
      '<div class="story-top">' +
        '<div class="story-user">' +
          '<div class="story-user-avatar"><img src="' + data.avatar + '" alt="avatar"></div>' +
          '<div><span class="story-user-name">' + userId + '</span><span class="story-user-time">hace 1h</span></div>' +
        '</div>' +
        '<button class="story-close" id="storyClose">&times;</button>' +
      '</div>' +
      '<div class="story-content-area" style="background:' + story.gradient + '">' +
        '<div class="story-tap-left" id="storyPrev"></div>' +
        '<div class="story-content-inner">' +
          '<div class="story-content-emoji">' + story.emoji + '</div>' +
          '<div class="story-content-text">' + story.text + '</div>' +
        '</div>' +
        '<div class="story-tap-right" id="storyNext"></div>' +
      '</div>' +
      '<div class="story-bottom">' +
        '<div class="story-bottom-left">' +
          '<input type="text" class="story-reply-input" placeholder="Enviar mensaje\u2026" />' +
          '<button class="story-send-btn">\u27A4</button>' +
        '</div>' +
        '<div class="story-bottom-right">' +
          '<button class="story-like-btn" id="storyLikeBtn">' +
            '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>' +
          '</button>' +
          '<button class="story-share-btn" id="storyShareBtn">' +
            '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="1.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(viewer);
    document.body.style.overflow = 'hidden';

    // Close handler
    document.getElementById('storyClose').addEventListener('click', closeStoryViewer);

    // Tap handlers
    document.getElementById('storyPrev').addEventListener('click', (e) => { e.stopPropagation(); navigateStory(-1); });
    document.getElementById('storyNext').addEventListener('click', (e) => { e.stopPropagation(); navigateStory(1); });

    // Tap on content area itself = next (with double-tap detection)
    let contentClickTimer = null;
    viewer.querySelector('.story-content-area').addEventListener('click', (e) => {
      if (e.target.closest('.story-content-inner') || e.target.closest('.story-tap-left') || e.target.closest('.story-tap-right')) return;
      if (contentClickTimer) {
        clearTimeout(contentClickTimer);
        contentClickTimer = null;
        return;
      }
      contentClickTimer = setTimeout(() => {
        navigateStory(1);
        contentClickTimer = null;
      }, 260);
    });

    // Keyboard
    const keyHandler = (e) => {
      if (e.key === 'Escape') closeStoryViewer();
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); navigateStory(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); navigateStory(-1); }
    };
    document.addEventListener('keydown', keyHandler);

    // ── Reply: Enter key ──
    const replyInput = viewer.querySelector('.story-reply-input');
    const sendReply = () => {
      const val = replyInput.value.trim();
      if (!val) return;
      const replies = JSON.parse(localStorage.getItem('storyReplies_' + userId) || '[]');
      replies.push({ text: val, timestamp: Date.now() });
      localStorage.setItem('storyReplies_' + userId, JSON.stringify(replies));
      replyInput.value = '';
      const toast = document.createElement('div');
      toast.className = 'story-toast';
      toast.textContent = 'Mensaje enviado a ' + userId;
      viewer.querySelector('.story-bottom').appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    };
    replyInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendReply(); });
    viewer.querySelector('.story-send-btn').addEventListener('click', sendReply);

    // ── Like button ──
    const likeKey = 'storyLiked_' + userId + '_' + s.currentStoryIdx;
    const likeBtn = document.getElementById('storyLikeBtn');
    const likeSvg = likeBtn.querySelector('svg');
    const isLiked = localStorage.getItem(likeKey) === 'true';
    if (isLiked) {
      likeSvg.style.fill = '#ed4956';
      likeSvg.style.stroke = '#ed4956';
    }
    likeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const liked = localStorage.getItem(likeKey) !== 'true';
      localStorage.setItem(likeKey, liked);
      likeSvg.style.fill = liked ? '#ed4956' : 'none';
      likeSvg.style.stroke = liked ? '#ed4956' : '';
      if (liked) likeSvg.style.animation = 'heartPop .3s ease';
      else likeSvg.style.animation = '';
      setTimeout(() => { likeSvg.style.animation = ''; }, 300);
    });

    // ── Double-tap to like on content ──
    viewer.querySelector('.story-content-area').addEventListener('dblclick', (e) => {
      if (e.target.closest('.story-tap-left') || e.target.closest('.story-tap-right')) return;
      if (contentClickTimer) {
        clearTimeout(contentClickTimer);
        contentClickTimer = null;
      }
      const alreadyLiked = localStorage.getItem(likeKey) === 'true';
      if (!alreadyLiked) {
        likeBtn.click();
      }
      showFloatingHeart(viewer.querySelector('.story-content-area'));
    });

    // ── Share button ──
    document.getElementById('storyShareBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      showShareModal(userId);
    });

    // Start auto-advance
    startAutoAdvance();

    // Store cleanup
    viewer._keyHandler = keyHandler;

    // Animate progress fill
    requestAnimationFrame(() => {
      const activeBar = viewer.querySelector('.story-progress-bar.active .fill');
      if (activeBar) activeBar.style.transition = 'width ' + 4 + 's linear';
      requestAnimationFrame(() => { if (activeBar) activeBar.style.width = '100%'; });
    });
  }

  function navigateStory(dir) {
    clearAutoAdvance();
    const s = viewerState;
    const userStories = storyData[s.userIds[s.currentUserIdx]].stories;

    let newUserIdx = s.currentUserIdx;
    let newStoryIdx = s.currentStoryIdx + dir;

    if (newStoryIdx < 0) {
      newUserIdx--;
      if (newUserIdx < 0) { closeStoryViewer(); return; }
      newStoryIdx = storyData[s.userIds[newUserIdx]].stories.length - 1;
    } else if (newStoryIdx >= userStories.length) {
      newUserIdx++;
      if (newUserIdx >= s.userIds.length) { closeStoryViewer(); return; }
      newStoryIdx = 0;
    }

    markStorySeen(s.userIds[newUserIdx]);
    s.currentUserIdx = newUserIdx;
    s.currentStoryIdx = newStoryIdx;
    s.elapsed = 0;

    const oldViewer = document.getElementById('storyViewer');
    if (oldViewer) { oldViewer.remove(); document.removeEventListener('keydown', oldViewer._keyHandler); }

    renderStoryViewer();
  }

  function startAutoAdvance() {
    clearAutoAdvance();
    viewerState.elapsed = 0;
    viewerState.interval = setInterval(() => {
      viewerState.elapsed += 0.1;
      if (viewerState.elapsed >= 4) {
        navigateStory(1);
      }
    }, 100);
  }

  function clearAutoAdvance() {
    if (viewerState?.interval) { clearInterval(viewerState.interval); viewerState.interval = null; }
  }

  function closeStoryViewer() {
    clearAutoAdvance();
    const viewer = document.getElementById('storyViewer');
    if (viewer) {
      viewer.classList.add('closing');
      document.removeEventListener('keydown', viewer._keyHandler);
      setTimeout(() => { viewer.remove(); document.body.style.overflow = ''; }, 200);
    }
    viewerState = null;
  }

  // ── Share modal ──
  function showShareModal(userId) {
    const existing = document.querySelector('.share-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'share-modal';
    overlay.innerHTML =
      '<div class="share-modal-backdrop"></div>' +
      '<div class="share-modal-content">' +
        '<div class="share-modal-header">Compartir historia de ' + userId + '</div>' +
        '<div class="share-option" data-action="feed"><span class="share-icon">\uD83D\uDCF0</span><span>Compartir en feed</span></div>' +
        '<div class="share-option" data-action="dm"><span class="share-icon">\uD83D\uDCEC</span><span>Enviar a mensaje directo</span></div>' +
        '<div class="share-option" data-action="copy"><span class="share-icon">\uD83D\uDCCB</span><span>Copiar enlace</span></div>' +
        '<div class="share-option share-cancel" data-action="cancel"><span>Cancelar</span></div>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    overlay.querySelectorAll('.share-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const action = opt.dataset.action;
        if (action === 'feed') {
          alert('Historia compartida en tu feed');
        } else if (action === 'dm') {
          alert('Historia enviada a tus mensajes');
        } else if (action === 'copy') {
          navigator.clipboard?.writeText(window.location.href)
            .then(() => alert('Enlace copiado'))
            .catch(() => alert('Enlace copiado'));
        }
        overlay.remove();
        document.body.style.overflow = '';
      });
    });

    overlay.querySelector('.share-modal-backdrop').addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = '';
    });
  }

  // Bind story clicks
  document.querySelectorAll('.story[data-story-id]').forEach(el => {
    el.addEventListener('click', () => openStoryViewer(el.dataset.storyId));
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
