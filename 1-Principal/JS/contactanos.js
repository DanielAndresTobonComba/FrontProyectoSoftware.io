function enviarFormulario(event) {
    // Evita que la página se recargue
    if (event) event.preventDefault();

    console.log("ENVIANDO FORMULARIO...");

    // Inputs
    const nombre = document.getElementById("nombre");
    const apellidos = document.getElementById("apellidosRegistro");
    const correo = document.getElementById("correoRegistro");
    const direccion = document.getElementById("direccionRegistro");
    const telefono = document.getElementById("TelefonoRegistro");
    const comentarios = document.querySelector("textarea");
    const tipoFacturacion = document.querySelector('input[name="facturacion"]:checked');

    // Guardar placeholders originales si no existen
    document.querySelectorAll("input[type='text']").forEach(input => {
        if (!input.dataset.placeholderOriginal) {
            input.dataset.placeholderOriginal = input.placeholder;
        }
    });

    // Reset estilo antes de validar
    document.querySelectorAll("input[type='text']").forEach(input => {
        input.placeholder = input.dataset.placeholderOriginal;
        input.style.border = "";
        input.style.backgroundColor = "";
    });

    let valido = true;

    // Validación de campos vacíos
    const inputs = [nombre, apellidos, correo, direccion, telefono];
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.value = "";
            input.placeholder = "Dato inválido";
            input.style.border = "2px solid red";
            input.style.backgroundColor = "#ffd1d1";
            valido = false;
        }
    });

    if (!tipoFacturacion) {
        alert("Debe seleccionar un tipo de facturación.");
        valido = false;
    }

    if (!valido) {
        console.log("VALIDACIÓN FALLIDA");
        return; // ❗ No se envía fetch si falta un dato
    }

    // JSON para el backend
    const data = {
        nombre: nombre.value.trim(),
        apellidos: apellidos.value.trim(),
        correo: correo.value.trim(),
        direccion: direccion.value.trim(),
        telefono: telefono.value.trim(),
        facturacion: tipoFacturacion.value,
        comentarios: comentarios.value.trim()
    };

    console.log("JSON listo para enviar:", data);

    const url = "http://localhost:8080/api/contacto";

    // FETCH al backend
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error("Error en la petición: " + response.status);
        return response.json();
    })
    .then(res => {
        console.log("Respuesta del backend:", res);

        // Validación según la respuesta del backend
        if (res.message === "contacto enviado") {
            alert("Mensaje enviado con éxito!");
            document.querySelector("form").reset();
        } else {
            alert("No se pudo enviar el formulario.");
        }
    })
    .catch(error => console.error("ERROR FETCH:", error));
}




/* {
    "nombre": "Juan",
    "apellidos": "Pérez",
    "correo": "juan.perez@example.com",
    "direccion": "Calle Falsa 123",
    "telefono": "123456789",
    "tipoFacturacion": "Personal",
    "comentarios": "Interesado en más información."
} */