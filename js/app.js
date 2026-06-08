const usuario = getUsuario();

if (usuario) {  
    document.getElementById('welcome-message').textContent = `Bienvenido, ${usuario.nombre}!`;
} else {
    window.location.href = 'login.html';
}

function getUsuario() {
    const usuarioJSON = localStorage.getItem('usuario');
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}

const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
});

