const usuario = document.getElementById("usuario");
const password = document.getElementById("password");

const botonLogin = document.querySelector(".btn-primary");

const errorMsg = document.getElementById("error-msg");

botonLogin.addEventListener("click", function() {

    let user = usuario.value;
    let pass = password.value;

    if(user === "" || pass === "") {

        errorMsg.textContent = "Completa todos los campos";

    } else {

        errorMsg.textContent = "Inicio de sesión exitoso";

    }

});


function togglePassword() {

    if(password.type === "password") {

        password.type = "text";

    } else {

        password.type = "password";

    }

}