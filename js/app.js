/* ===== PÁGINAS ===== */
const PAGINAS = [
    { id: 'home',     label: 'Inicio',    href: 'home.html' },
    { id: 'search',   label: 'Buscar',    href: 'search.html' },
    { id: 'reels',    label: 'Reels',     href: 'reels.html' },
    { id: 'messages', label: 'Mensajes',  href: 'mensajes.html' },
    { id: 'profile',  label: 'Perfil',    href: 'perfil.html' },
];

function paginaActual() {
    return window.location.pathname.split('/').pop() || 'home.html';
}

/* ===== LOGIN ===== */
document.addEventListener('DOMContentLoaded', () => {
    const inputUsuario = document.getElementById('usuario');
    const inputPassword = document.getElementById('password');
    const btnLogin = document.querySelector('.btn-primary');
    const errorMsg = document.getElementById('error-msg');

    if (!btnLogin) return;

    function iniciarSesion() {
        const usuario = inputUsuario.value.trim();
        const password = inputPassword.value.trim();

        if (!usuario || !password) {
            mostrarError('Por favor, completa todos los campos.');
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const encontrado = usuarios.find(
            u => (u.usuario === usuario || u.telefono === usuario) && u.password === password
        );

        if (encontrado) {
            localStorage.setItem('usuario', JSON.stringify({
                nombre: encontrado.nombre,
                usuario: encontrado.usuario
            }));
            window.location.href = 'home.html';
        } else {
            mostrarError('Usuario o contraseña incorrectos.');
        }
    }

    function mostrarError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        setTimeout(() => { errorMsg.style.display = 'none'; }, 4000);
    }

    btnLogin.addEventListener('click', iniciarSesion);
    if (inputUsuario) {
        inputUsuario.addEventListener('keydown', e => {
            if (e.key === 'Enter') inputPassword.focus();
        });
    }
    if (inputPassword) {
        inputPassword.addEventListener('keydown', e => {
            if (e.key === 'Enter') iniciarSesion();
        });
    }
});

/* ===== TOGGLE CONTRASEÑA ===== */
function togglePassword() {
    const input = document.getElementById('password');
    if (!input) return;
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
}

/* ===== NAVEGACIÓN INFERIOR ===== */
function iconoNav(id) {
    const icons = {
        home:     '<svg viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
        search:   '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>',
        reels:    '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" rx="4"/><path d="M2 8h20M8 3v18"/><path d="M10 10l5 3-5 3z"/></svg>',
        messages: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
        profile:  '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 017-7h4a7 7 0 017 7v2"/></svg>',
    };
    return icons[id] || icons.home;
}

function renderNav() {
    const actual = paginaActual();
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';

    PAGINAS.forEach(p => {
        const activo = p.href === actual;
        const a = document.createElement('a');
        a.className = `nav-item${activo ? ' active' : ''}`;
        a.href = p.href;
        a.innerHTML = `${iconoNav(p.id)}<span>${p.label}</span>`;

        if (!activo) {
            a.addEventListener('click', e => {
                e.preventDefault();
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.15s';
                setTimeout(() => { window.location.href = p.href; }, 150);
            });
        }

        nav.appendChild(a);
    });

    document.body.appendChild(nav);
}

/* ===== INICIO ===== */
document.addEventListener('DOMContentLoaded', () => {
    const pagina = paginaActual();

    // Solo páginas internas (no login/registro)
    const esPaginaInterna = PAGINAS.some(p => p.href === pagina);

    if (esPaginaInterna) {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario) {
            window.location.href = 'index.html';
            return;
        }
        renderNav();
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.15s';
    }
});
