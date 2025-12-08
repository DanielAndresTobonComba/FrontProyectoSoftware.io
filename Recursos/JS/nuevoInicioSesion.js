// Muestra los datos del usuario si está logueado, si no muestra la tarjeta de inicio de sesión
function mostrarDatosOSesion() {
    const nombre = localStorage.getItem("nombre");
    const contrasena = localStorage.getItem("contraseña");
    if (nombre && contrasena) {
        // Mostrar sección de datos
        document.getElementById("seccionMostrarDatos").style.visibility = "visible";
        document.getElementById("spanUsuario").textContent = nombre;
        document.getElementById("spanContraseña").textContent = contrasena;
    } else {
        // Mostrar tarjeta de inicio de sesión
        document.getElementById("tarjetaIniciarSesion").style.visibility = "visible";
    }
}
/* Seccion tarjeta incio sesion si no esta logueado muestre la tarjeta de logueo */

function datosiniciarSesion() {

    console.log("ENTRE AL NUEVO INICIO 1")
    let tarjetaInicioSesion = document.getElementById("tarjetaIniciarSesion")

    console.log(localStorage.getItem("nombre"))
    console.log(localStorage.getItem("contraseña"))

    if (localStorage.getItem("nombre") != null && localStorage.getItem("contraseña") != null) {
        console.log("Existen los datos")
    } else {
        tarjetaInicioSesion.style.visibility = "visible"
    }
}


/* Tomamos los datos de logueo y manda la peticion al backend si hay respuesta positiva logueo exitoso y muestra los datos de logueo */
function iniciosesion() {

    let tarjetaMostrarDatos = document.getElementById("seccionMostrarDatos");

    let usuarioIS = document.getElementById("usuarioInicioSesion").value;
    let contraseñaIS = document.getElementById("contraseñaInicioSesion").value;

    let spanUsuario = document.getElementById("spanUsuario");
    let spanContraseña = document.getElementById("spanContraseña");

    let inputNombre = document.getElementById("usuarioInicioSesion");
    let inputContraseña = document.getElementById("contraseñaInicioSesion");

    if (usuarioIS !== "" && contraseñaIS !== "") {

        const data = {
            nombre: usuarioIS,
            contrasena: contraseñaIS   
        };

        fetch("http://localhost:8080/api/registro/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        .then(response => {
            if (!response.ok) throw new Error("Error en la petición " + response.status);
            return response.json();
        })

        .then(res => {
            console.log("Respuesta del backend:", res);

            if (res.usuario) { // 👈 CAMBIADO
                localStorage.setItem("nombre", usuarioIS);
                localStorage.setItem("contraseña", contraseñaIS);

                cerrarInicioSesion();
                tarjetaMostrarDatos.style.visibility = "visible";
                spanUsuario.textContent = usuarioIS;
                spanContraseña.textContent = contraseñaIS;

                console.log("Inicio de sesión exitoso");

                // 🔄 Recargar la pagina
                location.reload();
            } 
            else {
                inputNombre.value = "El usuario no existe";
                inputContraseña.value = "";
                inputContraseña.placeholder = "Contraseña incorrecta";
            }
        })

        .catch(error => console.error("Error:", error));
    }
}

/* Cerrar sesión */
function cerrarSesion() {
    localStorage.removeItem("nombre");
    localStorage.removeItem("contraseña");

    console.log("Sesión cerrada");

    // 🔄 Recargar la pagina
    location.reload();
}
