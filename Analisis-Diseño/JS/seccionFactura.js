
let valorTotal = 0;
let ids = [];
/* SECCION FACTURAS */

function mostrarFactura() {
    let factura = document.querySelector(".facturaActual");
    let contenedorFactura = document.querySelector("tbody");
    let botonCompra = document.getElementById("botonConfirmarCompra");

    if (contenedorFactura.style.visibility == "visible") {
        contenedorFactura.style.visibility = "hidden";
        botonCompra.style.visibility = "hidden";
        factura.style.visibility = "hidden";
    } else {
        contenedorFactura.style.visibility = "visible";
        botonCompra.style.visibility = "visible";
        factura.style.visibility = "visible";
    }
}

function crearFactura(tarjeta, cantidad, accion) {
    let tabla = document.querySelector("table tbody");
    let nombreProducto = tarjeta.querySelector(".textoTarjeta p").textContent.trim();
    let casillaValorTotal = document.getElementById("valorTotalCasilla");

    // Buscar producto real del backend por nombre (comparar trim para evitar fallos)
    let producto = productosBackend.find(p => (p.nombre || "").trim() === nombreProdutoNorm(nombreProducto));
    if (!producto) {
        // Intentar buscar sin normalizar por si hay diferencias mínimas
        producto = productosBackend.find(p => (p.nombre || "").trim() === nombreProducto);
    }
    if (!producto) return;

    let idProducto = producto.idProducto;  // ID real del backend
    let precioUnitario = Number(producto.precio);
    let fila = document.querySelector(`tr[data-idproducto="${idProducto}"]`);

    if (accion === "sumar") {
        if (!fila) {
            fila = tabla.insertRow();
            fila.setAttribute("data-idproducto", idProducto);

            // Creando celdas de la fila
            const celNombre = fila.insertCell(0);
            const celCantidad = fila.insertCell(1);
            const celPrecio = fila.insertCell(2);
            const celSubtotal = fila.insertCell(3);

            celNombre.textContent = producto.nombre;
            celCantidad.textContent = 1;
            celPrecio.textContent = formatNumberPlain(precioUnitario); // guardamos número "2500" o "2500.00"
            celSubtotal.textContent = formatNumberPlain(precioUnitario);

            // agregar al array de ids si usas
            if (!ids.includes(idProducto)) ids.push(idProducto);
        } else {
            let celdaCantidad = fila.children[1];
            let celdaSubtotal = fila.children[3];

            let nuevaCantidad = parseInt(celdaCantidad.textContent, 10) + 1;
            celdaCantidad.textContent = nuevaCantidad;
            celdaSubtotal.textContent = formatNumberPlain(nuevaCantidad * precioUnitario);
        }

        valorTotal += precioUnitario;
        casillaValorTotal.textContent = formatNumberPlain(valorTotal);
    } else if (accion === "restar" && fila) {
        let celdaCantidad = fila.children[1];
        let celdaSubtotal = fila.children[3];

        let nuevaCantidad = parseInt(celdaCantidad.textContent, 10) - 1;

        if (nuevaCantidad <= 0) {
            fila.remove();
            ids = ids.filter(item => item !== idProducto);
        } else {
            celdaCantidad.textContent = nuevaCantidad;
            celdaSubtotal.textContent = formatNumberPlain(nuevaCantidad * precioUnitario);
        }

        valorTotal -= precioUnitario;
        if (valorTotal < 0) valorTotal = 0;
        casillaValorTotal.textContent = formatNumberPlain(valorTotal);
    }
}

// helper: formatea número en plain (sin puntos de miles) para enviar/usar en cálculos
function formatNumberPlain(n) {
    if (isNaN(n)) return "0";
    // devuelve string con decimales si tiene
    return Number(n).toFixed(2).replace(/\.00$/, ""); // opcional quitar .00 si prefieres
}

// helper normalización nombres (quita dobles espacios, poner trim)
function nombreProdutoNorm(s) {
    return s.replace(/\s+/g, ' ').trim();
}



function identificar(boton) {
    let padreCercano = boton.parentElement;

    if (padreCercano.children.length <= 1) {
        boton.style.display = "none";
        let seccionBotones = `
            <button onclick="restar(this)" >Retirar</button>
            <p>0</p>
            <button onclick="sumar(this)" >Añadir</button>
        `;

        let div = document.createElement("div");
        div.setAttribute("class", "seccionBotones");
        div.innerHTML = seccionBotones;
        boton.parentElement.appendChild(div);
    } else {
        boton.style.display = "flex";
    }
}

/* 🔥 NUEVO: OBTENER PRODUCTOS DE LA FACTURA */
function obtenerProductosFactura() {
    const filas = document.querySelectorAll('.facturaActual table tbody tr');
    let productos = [];

    filas.forEach(fila => {
        const id = fila.getAttribute("data-idproducto");
        if (!id) return;

        productos.push({
            idProducto: id,
            cantidad: parseInt(fila.children[1].textContent, 10),
            precioUnitario: Number(fila.children[2].textContent),
            subtotal: Number(fila.children[3].textContent)
        });
    });

    return productos;
}


/* 🔥 NUEVO: ENVIAR FACTURA AL BACKEND */
async function confirmarCompra() {
    let usuario = localStorage.getItem("nombre");

    try {
        usuario = JSON.parse(usuario);   // Si es JSON, parsea
    } catch (e) {}

    if (!usuario) {
        mostrarAlertaBonita("Debe iniciar sesión para comprar", "#f44336");
        return;
    }

    if (typeof usuario === "string") {
        usuario = { nombre: usuario };
    }

    const productosFactura = obtenerProductosFactura();
    if (productosFactura.length === 0) {
        mostrarAlertaBonita("No hay productos en la factura", "#f44336");
        return;
    }

    // obtener ID del usuario desde backend por nombre
    let idUsuario = null;
    try {
        const resUsuario = await fetch(`http://localhost:8080/api/registro/${encodeURIComponent(usuario.nombre)}`);
        if (!resUsuario.ok) throw new Error("Usuario no encontrado");
        const dataUsuario = await resUsuario.json();
        idUsuario = dataUsuario.id;
    } catch (err) {
        console.error("Error obteniendo usuario:", err);
        mostrarAlertaBonita("No se encontró el usuario en el sistema", "#f44336");
        return;
    }

    // total: tomar número del DOM y parsearlo
    const totalText = document.getElementById("valorTotalCasilla").textContent || "0";
    const total = Number(totalText);

    const facturaJSON = {
        fecha: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        productos: productosFactura.map(p => ({
            idProducto: p.idProducto,
            cantidad: p.cantidad,
            precioUnitario: p.precioUnitario,
            subtotal: p.subtotal
        })),
        total: total,
        usuario: { id: idUsuario }
    };

    console.log("Se enviará al backend:", facturaJSON);

    try {
        const response = await fetch("http://localhost:8080/api/facturaSurtitiendas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(facturaJSON)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error("HTTP " + response.status + " - " + text);
        }

        const data = await response.json();
        mostrarAlertaBonita("Factura guardada exitosamente");
        console.log("Respuesta del backend:", data);
        eliminarTabla();

        setTimeout(() => location.reload(), 1200);
    } catch (error) {
        console.error("Error al enviar factura:", error);
        mostrarAlertaBonita("Error al guardar la factura", "#561712ff");
    }
}


/* LIMPIAR TABLA DESPUÉS DE ENVIAR AL BACKEND */
function eliminarTabla() {
    const seccion = document.querySelector('.facturaActual');
    const tabla = seccion.querySelector('table');
    const filas = tabla.querySelectorAll('tr');

    if (filas.length <= 1) {
        mostrarAlertaBonita("No hay productos en la factura", "#f44336");
        return;
    }

    seccion.style.visibility = 'hidden';
    for (let i = filas.length - 1; i > 0; i--) {
        tabla.deleteRow(i);
    }

    document.getElementById('valorTotalCasilla').textContent = '0';
}

/* ALERTAS BONITAS */
function mostrarAlertaBonita(mensaje, colorFondo = "#4CAF50") {
    const alerta = document.createElement('div');
    alerta.textContent = mensaje;
    alerta.style.position = 'fixed';
    alerta.style.top = '50%';
    alerta.style.left = '50%';
    alerta.style.transform = 'translate(-50%, -50%)';
    alerta.style.backgroundColor = colorFondo;
    alerta.style.color = 'white';
    alerta.style.padding = '20px 40px';
    alerta.style.fontSize = '20px';
    alerta.style.borderRadius = '10px';
    alerta.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    alerta.style.zIndex = '9999';
    alerta.style.textAlign = 'center';

    document.body.appendChild(alerta);
    setTimeout(() => alerta.remove(), 2500);
}
