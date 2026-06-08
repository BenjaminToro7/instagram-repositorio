const telefono = document.getElementById("telefono");
const nombre = document.getElementById("nombre");
const usuario = document.getElementById("usuario");
const password = document.getElementById("password");

const btnRegister = document.getElementById("btnRegister");
const errorMsg = document.getElementById("error-msg");

btnRegister.addEventListener("click", function() {

    let tel = telefono.value;
    let nom = nombre.value;
    let user = usuario.value;
    let pass = password.value;

    if(tel === "" || nom === "" || user === "" || pass === "") {

        errorMsg.textContent = "Completa todos los campos";

    } else {

        localStorage.setItem("usuario", user);
        localStorage.setItem("password", pass);
        localStorage.setItem("nombre", nom);

        window.location.href = "home.html";

    }

});


function togglePassword() {

    if(password.type === "password") {

        password.type = "text";

    } else {

        password.type = "password";

    }

}


const cerrarSesion = document.getElementById("cerrarSesion");

cerrarSesion.addEventListener("click", function() {

    localStorage.removeItem("usuario");
    localStorage.removeItem("password");
    localStorage.removeItem("nombre");

    window.location.href = "index.html";

});