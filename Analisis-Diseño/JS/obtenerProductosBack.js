// Al inicio del archivo (si no lo tienes ya)
let productosBackend = [];

// Reemplaza la función insertarProductos() completa por esto:
function insertarProductos() {
    console.log("Insertando productos desde el backend...");
    
    let contenedor = document.querySelector(".productos");
    contenedor.innerHTML = ``;

    const url = "http://localhost:8080/api/productoSurtitiendas";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la petición: " + response.status);
            }
            return response.json();
        })
        .then(json => {
            console.log("Productos recibidos:", json);

            // Guardar array globalmente para usar idProducto luego
            productosBackend = Array.isArray(json) ? json : [];

            if (!Array.isArray(json) || json.length === 0) {
                contenedor.innerHTML = `<p>No hay productos disponibles.</p>`;
                return;
            }

            json.forEach(producto => {
                let elemento = `
                <div class="tarjeta">
                    <div class="textoTarjeta">
                        <p>${producto.nombre}</p>
                    </div>

                    <img src="${producto.imagenUrl}" alt="Imagen de ${producto.nombre}">

                    <div class="detalleProducto">
                        <button class="botonDetalles" onclick="mostrar(this)">Detalles</button>

                        <section class="detalles">
                            <p>Tamaño: ${producto.tamano || 'N/A'}</p>
                            <p>Precio: $${producto.precio}</p>
                        </section>
                    </div>

                    <div class="seccionBotonOrdenar">
                        <button id="botonOrdenar" onclick="identificar(this)">Ordenar</button>
                    </div>
                </div>
                `;
                contenedor.innerHTML += elemento;
            });
        })
        .catch(error => {
            console.error("Error obteniendo los productos:", error);
            contenedor.innerHTML = `<p>Error al cargar los productos.</p>`;
        });
}

insertarProductos();
