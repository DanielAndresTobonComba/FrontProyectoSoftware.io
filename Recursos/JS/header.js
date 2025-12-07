// ESTE MÉTODO INYECTA EL FRONT ANTES DE QUE EL HTML SE PINTE
document.write(`
    <div class="tituloEmpresa">
        <p>Surtitiendas Ubate</p>
    </div>
    
    
    <header id="header">
        <div class="seccionLogo ">
            <div class="logo "></div>
            
            <div class="seccionInicio">
                <div class="iniciarSesion ">
                    <svg  class="simboloInicioSesion" onclick="mostrarDatosOSesion()" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user" width="100%" height="80%" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                      </svg>
                    
                </div>

                <div class="registrarte ">
                    <svg class="simboloInicioSesion" onclick="datosiniciarSesion()" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-plus" width="100%" height="80%" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                        <path d="M16 19h6" />
                        <path d="M19 16v6" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
                      </svg>
                      
                </div>

                <div class="registrarte sin ">
                    <svg  class="simboloInicioSesion" onclick="mostrarTarjeta()" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-x" width="100%" height="80%" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" />
                        <path d="M22 22l-5 -5" />
                        <path d="M17 22l5 -5" />
                      </svg>
                      
                      
                </div> 

                
            </div>
            
        </div>

        <div class="seccionMenu">
                <a href="../1-Principal/paginaPrincipal.html" class="opcionMenu">Nosotros</a>
                <a href="../3-compra.alqueria/compra.html" class="opcionMenu">Compra Alqueria</a>
                <a href="../4-facturacion/facturacion.html" class="opcionMenu">Facturación</a>
                <a href="../4-form-prod/main.html" class="opcionMenu">Productos</a>
        </div>


    </header>
    <!-- Sección de inicio sesion etc -->

    <div id="tarjetaIniciarSesion">

        <h2 style="color: black;">Iniciar Sesion</h2>

        <section id="entradaDatos">

            <input id="usuarioInicioSesion" type="text" placeholder="Nombre de usuario">

            <input id="contraseñaInicioSesion" type="text" placeholder="Contraseña">
            
            <a id=enlaceRegistro onclick="registro(this) , cerrarInicioSesion() " >Registrarse</a>

        </section>
        
        <section id="botones">
            <button onclick ="cerrarInicioSesion()" id="botonSalir">Cerrar</button>
            <button onclick="iniciosesion()" id="botonIngresar" >Ingresar</button>
        </section>
    </div>
    
    <div id="seccionMostrarDatos">

        <h2>Usuario</h2>
        <p><span id="spanUsuario"></span></p>
        <p><span id="spanContraseña"></span></p> 
        <button onclick="cerrarDatos()">Ok</button>

    </div>

    <div id="seccionRegistro" style="visibility: hidden;">

        <button onclick="salirRegistro()">Cerrar</button>
        <button onclick="tomarDatosRegistro()">Enviar</button>
        
    </div>
    
    <div id="tarjetaCerrarSesion" style="visibility: hidden;" >

        <h2>Desea cerrar sesion</h2>

        <div id="botonesCerrarSesion">
            <button onclick="cerrarTarjeta()">No</button>
            <button onclick="cerrarSesion() , mostrarTarjeta()">Si</button>
        </div>
    </div>
`);
