// Archivo: historialFacturas.js

let facturasGlobal = [];
let paginaActual = 1;
const FACTURAS_POR_PAGINA = 5;

document.addEventListener("DOMContentLoaded", () => {
    const nombre = localStorage.getItem("nombre");

    console.log("Usuario logueado:", nombre);

    if (nombre) {
        fetch(`http://localhost:8080/api/facturaAlqueria/historialFacturas/${nombre}`)
            .then(res => {
                if (!res.ok) throw new Error("Error en la petición " + res.status);
                return res.json();
            })
            .then(data => {
                console.log("Facturas recibidas:", data);

                facturasGlobal = data; 
                renderTablaFacturas();
            })
            .catch(err => {
                console.error("Error obteniendo historial:", err);
            });
    } else {
        console.log("No hay usuario logueado en localStorage");
    }
});

function renderTablaFacturas() {
    const tbody = document.querySelector("#tablaHistorial tbody");
    tbody.innerHTML = ""; 

    const inicio = (paginaActual - 1) * FACTURAS_POR_PAGINA;
    const fin = inicio + FACTURAS_POR_PAGINA;
    const facturasPagina = facturasGlobal.slice(inicio, fin);

    facturasPagina.forEach(factura => {
        const fila = document.createElement("tr");
        fila.classList.add("filaFactura");

        fila.innerHTML = `
            <td>${factura.fecha ? factura.fecha : "Sin fecha"}</td>
            <td>${factura.numeroFactura}</td>
            <td>${factura.cliente}</td>
            <td>$${factura.total.toLocaleString("es-CO")}</td>
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

        factura.detalles.forEach(det => {
            detallesHTML += `
                <tr>
                    <td>${det.producto}</td>
                    <td>${det.cantidad}</td>
                    <td>$${det.precioUnitario.toLocaleString("es-CO")}</td>
                    <td>$${det.subtotal.toLocaleString("es-CO")}</td>
                </tr>
            `;
        });

        detallesHTML += `</tbody></table></div></td>`;
        filaDetalles.innerHTML = detallesHTML;
        tbody.appendChild(filaDetalles);
    });

    activarBotonesDetalles();
    renderPaginacion();
}

function activarBotonesDetalles() {
    const botones = document.querySelectorAll(".btnDetalles");

    botones.forEach(btn => {
        btn.addEventListener("click", () => {
            const filaFactura = btn.closest("tr");
            const filaDetalles = filaFactura.nextElementSibling;

            document.querySelectorAll(".filaDetalles:not(.oculto)").forEach(detalle => {
                if (detalle !== filaDetalles) {
                    detalle.classList.add("oculto");
                    const botonOtro = detalle.previousElementSibling.querySelector(".btnDetalles");
                    if (botonOtro) botonOtro.textContent = "Detalles ▼";
                }
            });

            filaDetalles.classList.toggle("oculto");
            btn.textContent = filaDetalles.classList.contains("oculto") ? "Detalles ▼" : "Detalles ▲";
        });
    });
}

/* 🔹 SOLO SE MODIFICÓ ESTO */
function renderPaginacion() {
    const contenedorPag = document.getElementById("paginacion");
    if (!contenedorPag) return;

    contenedorPag.innerHTML = "";

    const totalPaginas = Math.ceil(facturasGlobal.length / FACTURAS_POR_PAGINA);

    // Botón anterior <
    const btnPrev = document.createElement("button");
    btnPrev.textContent = "<";
    btnPrev.disabled = paginaActual === 1;
    btnPrev.addEventListener("click", () => {
        paginaActual--;
        renderTablaFacturas();
    });
    contenedorPag.appendChild(btnPrev);

    // Número de página actual SOLO UNO
    const indicador = document.createElement("span");
    indicador.textContent = ` ${paginaActual} `;
    indicador.style.margin = "0 10px";
    contenedorPag.appendChild(indicador);

    // Botón siguiente >
    const btnNext = document.createElement("button");
    btnNext.textContent = ">";
    btnNext.disabled = paginaActual === totalPaginas;
    btnNext.addEventListener("click", () => {
        paginaActual++;
        renderTablaFacturas();
    });
    contenedorPag.appendChild(btnNext);
}
