

let nombreUsuario = localStorage.getItem("nombre")
let contraseñaUsuario = localStorage.getItem("contraseña")

console.log("Nombre: " + localStorage.getItem("nombre"))
console.log("Contraseña: " + localStorage.getItem("contraseña"))


let aviso = document.getElementById("aviso")

if (nombreUsuario == null || contraseñaUsuario == null) {

    aviso.style.visibility = "visible"

} else {

    aviso.style.visibility = "hidden"
}




function restar(boton) {
    let tarjeta = boton.closest('.tarjeta');
    let seccionBotonOrdenar = boton.closest('.seccionBotonOrdenar');
    let botonOrdenar = seccionBotonOrdenar.querySelector('#botonOrdenar');

    let padre = boton.parentElement;
    let parrafo = padre.querySelector('p'); // <p> con el número
    let numero = parseInt(parrafo.textContent, 10);
    let accion = "restar";

    if (numero <= 1) {
        // Quita contador y muestra botón "Ordenar"
        padre.remove();
        parrafo.textContent = 0;
        botonOrdenar.style.display = "block";
    } else {
        numero--;
        parrafo.textContent = numero;
    }

    crearFactura(tarjeta, numero, accion);
}

function sumar(boton) {
    let tarjeta = boton.closest('.tarjeta');
    let padre = boton.parentElement;
    let parrafo = padre.querySelector('p');
    let numero = parseInt(parrafo.textContent, 10);
    numero++;
    parrafo.textContent = numero;

    let accion = "sumar";
    crearFactura(tarjeta, numero, accion);
}


function cerrarHistorial(){


    let seccionHistorial = document.getElementById("contenedorHistorial")
    let botonSumar = document.getElementById("botonSumar")
    let botonRestar = document.getElementById("botonRestar")

    seccionHistorial.style.visibility = "hidden"
    botonRestar.style.visibility = "hidden"
    botonSumar.style.visibility = "hidden"

    
}




function filtrar(contenido) {
    console.log("entre a filtrar con : " + contenido)
    let contenedor = document.querySelector(".productos")
    contenedor.innerHTML = `
            `

    fetch("productos.json")
        .then(data => data.json())
        .then(json => {
            json.productos.forEach(producto => {

                if (producto.nombre.includes(contenido)) {

                    let elemento = `

                    <div class="tarjeta" >

                        <div class="textoTarjeta">
                            
                            <p>${producto.nombre}</p>
                            
                        </div>

                    
                        <img src="${producto.imagen}" alt="">
                        

                        

                        <div class="detalleProducto">
                            
                            <button class="botonDetalles" onclick="mostrar(this)" >Detalles </button>

                            <section
                            
                                class="detalles" >
                                <p>Tamaño: ${producto.caracteristicas}</p>

                                <p>Precio: $ ${producto.precio}</p>

                                <p></p>

                            </section>
                        
                            
                        </div>
                        

                        <div class="seccionBotonOrdenar">

                            <button id="botonOrdenar" onclick="identificar(this)" >Ordenar</button>

            
                        </div>

                    </div>
                    `
                    contenedor.innerHTML += elemento

                } else if (contenedor.innerHTML === "") {
                    contenedor.innerHTML = ` 
                   <h1>No hay productos con su preferencias de filtro</h1>`
                }
            })
        })

}









/* function datos() {
    let entrada = document.getElementById("busqueda")
    let datos = entrada.value
    if (datos != "") {
        filtrar(datos)
    } else {
        insertarProductos()
    }

}
 */