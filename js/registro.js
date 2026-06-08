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

        errorMsg.textContent = "Debes completar todos los campos";

    } else {

        errorMsg.textContent = "Registro completado correctamente";

    }

});


function togglePassword() {

    if(password.type === "password") {

        password.type = "text";

    } else {

        password.type = "password";

    }

}