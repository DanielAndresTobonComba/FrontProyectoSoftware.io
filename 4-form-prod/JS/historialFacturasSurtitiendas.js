// Variables de paginación
let facturasGlobal = [];
let paginaActual = 1;
const facturasPorPagina = 5;

document.addEventListener("DOMContentLoaded", () => {
    const nombre = localStorage.getItem("nombre");

    console.log("Usuario logueado:", nombre);

    if (nombre) {
        fetch(`http://localhost:8080/api/facturaSurtitiendas/historial/${nombre}`)
            .then(res => {
                if (!res.ok) throw new Error("Error en la petición " + res.status);
                return res.json();
            })
            .then(data => {
                console.log("Facturas recibidas:", data);

                facturasGlobal = data;
                mostrarPagina(paginaActual);
                renderPaginacion();
            })
            .catch(err => console.error("Error obteniendo historial:", err));
    } else {
        console.log("No hay usuario logueado en localStorage");
    }
});

function mostrarPagina(pagina) {
    const inicio = (pagina - 1) * facturasPorPagina;
    const fin = inicio + facturasPorPagina;
    const facturasPagina = facturasGlobal.slice(inicio, fin);

    mostrarFacturas(facturasPagina);
}

function mostrarFacturas(facturas) {
    const tbody = document.querySelector("#listaFacturas");
    tbody.innerHTML = "";

    facturas.forEach(f => {
        const fila = document.createElement("tr");
        fila.classList.add("filaFactura");

        fila.innerHTML = `
            <td>${f.fecha ?? "Sin fecha"}</td>
            <td>${f.idFactura}</td>
            <td>${localStorage.getItem("nombre")}</td>
            <td>$${f.total.toLocaleString("es-CO")}</td>
            <td><button class="btnDetalles">Detalles ▼</button></td>
        `;
        tbody.appendChild(fila);

        const filaDetalles = document.createElement("tr");
        filaDetalles.classList.add("filaDetalles", "oculto");

        let detallesHTML = `
            <td colspan="6">
                <div class="detalleFactura">
                    <h4>Detalles</h4>
                    <table class="tablaInterna">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        f.productos.forEach(det => {
            detallesHTML += `
                <tr>
                    <td>${det.nombre}</td>
                    <td>${det.cantidad}</td>
                    <td>$${det.precioBase.toLocaleString("es-CO")}</td>
                    <td>$${det.subtotal.toLocaleString("es-CO")}</td>
                </tr>
            `;
        });

        detallesHTML += `
                        </tbody>
                    </table>
                </div>
            </td>
        `;

        filaDetalles.innerHTML = detallesHTML;
        tbody.appendChild(filaDetalles);
    });

    activarBotonesDetalles();
}

function activarBotonesDetalles() {
    const botones = document.querySelectorAll(".btnDetalles");

    botones.forEach(btn => {
        btn.addEventListener("click", () => {

            const filaFactura = btn.closest("tr");
            const filaDetalles = filaFactura.nextElementSibling;

            // ❗Cerrar las demás secciones antes de abrir la nueva
            document.querySelectorAll(".filaDetalles").forEach(sec => {
                if (sec !== filaDetalles) {
                    sec.classList.add("oculto");
                    const boton = sec.previousElementSibling.querySelector(".btnDetalles");
                    if (boton) boton.textContent = "Detalles ▼";
                }
            });

            const oculto = filaDetalles.classList.contains("oculto");
            filaDetalles.classList.toggle("oculto");
            btn.textContent = oculto ? "Detalles ▲" : "Detalles ▼";
        });
    });
}

/* PAGINACIÓN (solo 1 número visible) */
function renderPaginacion() {
    const contenedor = document.getElementById("paginacionFacturas");
    contenedor.innerHTML = "";

    const totalPaginas = Math.ceil(facturasGlobal.length / facturasPorPagina);

    const btnPrev = document.createElement("button");
    btnPrev.textContent = "<";
    btnPrev.disabled = paginaActual === 1;
    btnPrev.onclick = () => cambiarPagina(paginaActual - 1);

    const btnNum = document.createElement("button");
    btnNum.textContent = paginaActual;

    const btnNext = document.createElement("button");
    btnNext.textContent = ">";
    btnNext.disabled = paginaActual === totalPaginas;
    btnNext.onclick = () => cambiarPagina(paginaActual + 1);

    contenedor.appendChild(btnPrev);
    contenedor.appendChild(btnNum);
    contenedor.appendChild(btnNext);
}

function cambiarPagina(nueva) {
    paginaActual = nueva;
    mostrarPagina(paginaActual);
    renderPaginacion();

    // Cerrar detalles al cambiar de página
    document.querySelectorAll(".filaDetalles").forEach(sec => sec.classList.add("oculto"));
}
