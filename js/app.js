const usuario = document.getElementById("usuario");
const password = document.getElementById("password");

const botonLogin = document.querySelector(".btn-primary");
const errorMsg = document.getElementById("error-msg");

botonLogin.addEventListener("click", function() {

    let user = usuario.value;
    let pass = password.value;

    let usuarioGuardado = localStorage.getItem("usuario");
    let passwordGuardada = localStorage.getItem("password");

    if(user === usuarioGuardado && pass === passwordGuardada) {

        window.location.href = "home.html";

    } else {

        errorMsg.textContent = "Usuario o contraseña incorrectos";

    }

});


function togglePassword() {

    if(password.type === "password") {

        password.type = "text";

    } else {

        password.type = "password";

    }

}