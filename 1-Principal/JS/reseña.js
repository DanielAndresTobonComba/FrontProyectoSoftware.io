// Esperamos a que el DOM se cargue
document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("reseña");
  const btnEnviar = document.getElementById("btnEnviar");

  btnEnviar.addEventListener("click", async () => {
    const comentario = textarea.value.trim();

    console.log("Enviando comentario" , comentario)

    if (comentario === "") {
      alert("Por favor escribe una reseña antes de enviarla.");
      return;
    }

    // ➤ FORMATEAR FECHA ACTUAL A DIA-MES-AÑO
    const hoy = new Date();
    const fechaFormateada = `${hoy.getDate().toString().padStart(2, '0')}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy.getFullYear()}`;

    // Objeto a enviar
    const data = {
      comentario: comentario,
      fecha: fechaFormateada      // <-- SOLO DIA-MES-AÑO
    };

    try {
      const response = await fetch("http://localhost:8080/api/resena", {  // <-- CAMBIAR SEGÚN TU ENDPOINT
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("¡Gracias por tu reseña! 😊");
        textarea.value = ""; // Limpiamos el campo
      } else {
        alert("Hubo un error al enviar la reseña.");
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Error de conexión con el servidor.");
    }
  });
});


/* {
    "comentario": "HEIAFHBSAIUFDYUASFD",
    "usuario": "Pérez"
} */