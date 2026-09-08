// ==========================================
// VALIDACIÓN DEL FORMULARIO DE VOLUNTARIOS
// ==========================================

const formVoluntario = document.getElementById("formVoluntario");

if (formVoluntario) {

    formVoluntario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        let formularioValido = true;

        // Obtener elementos
        const nombre = document.getElementById("nombre");
        const apellido = document.getElementById("apellido");
        const rut = document.getElementById("rut");
        const email = document.getElementById("email");
        const telefono = document.getElementById("telefono");
        const region = document.getElementById("region");
        const comuna = document.getElementById("comuna");
        const direccion = document.getElementById("direccion");

        // Limpiar mensajes anteriores
        document.querySelectorAll(".mensaje-error").forEach(function (mensaje) {
            mensaje.textContent = "";
        });

        // Validar nombre
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]{2,50}$/.test(nombre.value.trim())) {
            document.getElementById("errorNombre").textContent =
                "Ingrese un nombre válido.";
            formularioValido = false;
        }

        // Validar apellido
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]{2,50}$/.test(apellido.value.trim())) {
            document.getElementById("errorApellido").textContent =
                "Ingrese un apellido válido.";
            formularioValido = false;
        }

        // Validar RUT chileno
        if (!validarRut(rut.value)) {
            document.getElementById("errorRut").textContent =
                "Ingrese un RUT chileno válido. Ej: 12.345.678-5";
            formularioValido = false;
        }

        // Validar correo
        const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!patronCorreo.test(email.value.trim())) {
            document.getElementById("errorEmail").textContent =
                "Ingrese un correo electrónico válido.";
            formularioValido = false;
        }

        // Validar teléfono
        const telefonoLimpio = telefono.value.replace(/\s/g, "");

        if (!/^(\+?56)?9\d{8}$/.test(telefonoLimpio)) {
            document.getElementById("errorTelefono").textContent =
                "Ingrese un teléfono chileno válido. Ej: +56912345678";
            formularioValido = false;
        }

        // Validar región
        if (region.value === "") {
            document.getElementById("errorRegion").textContent =
                "Debe seleccionar una región.";
            formularioValido = false;
        }

        // Validar comuna
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]{2,60}$/.test(comuna.value.trim())) {
            document.getElementById("errorComuna").textContent =
                "Ingrese una comuna válida.";
            formularioValido = false;
        }

        // Dirección es opcional.
        // Si se escribe, debe tener al menos 5 caracteres.
        if (
            direccion.value.trim() !== "" &&
            direccion.value.trim().length < 5
        ) {
            direccion.style.borderColor = "#b42318";
            formularioValido = false;
        } else {
            direccion.style.borderColor = "";
        }

        // Resultado de la validación
        if (formularioValido) {

            alert("Voluntario registrado correctamente.");

            formVoluntario.reset();

        }

    });
}


// ==========================================
// FUNCIÓN PARA VALIDAR EL RUT
// ==========================================

function validarRut(rut) {

    rut = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();

    if (!/^\d{7,8}[0-9K]$/.test(rut)) {
        return false;
    }

    const cuerpo = rut.slice(0, -1);
    const digitoVerificador = rut.slice(-1);

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {

        suma += parseInt(cuerpo[i]) * multiplicador;

        multiplicador++;

        if (multiplicador > 7) {
            multiplicador = 2;
        }
    }

    const resto = 11 - (suma % 11);

    let resultado;

    if (resto === 11) {
        resultado = "0";
    } else if (resto === 10) {
        resultado = "K";
    } else {
        resultado = resto.toString();
    }

    return resultado === digitoVerificador;
}


// ==========================================
// VALIDACIÓN DEL FORMULARIO DE AVISTAMIENTO
// ==========================================

const formAvistamiento = document.getElementById("formAvistamiento");

if (formAvistamiento) {

    formAvistamiento.addEventListener("submit", function (evento) {

        evento.preventDefault();

        let formularioValido = true;

        const voluntario = document.getElementById("voluntario");
        const tipoAve = document.getElementById("tipoAve");
        const nombreAve = document.getElementById("nombreAve");
        const lugar = document.getElementById("lugar");
        const fecha = document.getElementById("fecha");
        const hora = document.getElementById("hora");
        const evidencia = document.getElementById("evidencia");

        // Limpiar mensajes
        document.querySelectorAll(".mensaje-error").forEach(function (mensaje) {
            mensaje.textContent = "";
        });

        // Validar voluntario
        if (voluntario.value === "") {
            document.getElementById("errorVoluntario").textContent =
                "Debe seleccionar un voluntario.";
            formularioValido = false;
        }

        // Validar tipo de ave
        if (tipoAve.value === "") {
            document.getElementById("errorTipoAve").textContent =
                "Debe seleccionar un tipo de ave.";
            formularioValido = false;
        }

        // Validar nombre del ave
        if (
            nombreAve.value.trim().length < 2 ||
            nombreAve.value.trim().length > 80
        ) {
            document.getElementById("errorNombreAve").textContent =
                "Ingrese un nombre de ave válido.";
            formularioValido = false;
        }

        // Validar lugar
        if (lugar.value.trim().length < 3) {
            document.getElementById("errorLugar").textContent =
                "Ingrese un lugar válido.";
            formularioValido = false;
        }

        // Validar fecha
        if (fecha.value === "") {

            document.getElementById("errorFecha").textContent =
                "Debe seleccionar una fecha.";

            formularioValido = false;

        } else {

            const fechaSeleccionada = new Date(fecha.value + "T00:00:00");
            const hoy = new Date();

            hoy.setHours(0, 0, 0, 0);

            const fechaMinima = new Date();
            fechaMinima.setHours(0, 0, 0, 0);
            fechaMinima.setFullYear(fechaMinima.getFullYear() - 10);

            if (fechaSeleccionada > hoy) {

                document.getElementById("errorFecha").textContent =
                    "La fecha no puede ser futura.";

                formularioValido = false;

            } else if (fechaSeleccionada < fechaMinima) {

                document.getElementById("errorFecha").textContent =
                    "La fecha no puede tener más de 10 años.";

                formularioValido = false;
            }
        }

        // Validar hora
        if (hora.value === "") {

            document.getElementById("errorHora").textContent =
                "Debe seleccionar una hora.";

            formularioValido = false;

        } else if (fecha.value !== "") {

            const fechaIngresada = new Date(fecha.value + "T" + hora.value);
            const ahora = new Date();

            if (fechaIngresada > ahora) {

                document.getElementById("errorHora").textContent =
                    "La fecha y hora del avistamiento no pueden ser futuras.";

                formularioValido = false;
            }
        }

        // Validar fotografía o vídeo
        if (evidencia.files.length === 0) {

            document.getElementById("errorEvidencia").textContent =
                "Debe adjuntar al menos una fotografía o vídeo.";

            formularioValido = false;

        } else {

            const archivo = evidencia.files[0];

            if (
                !archivo.type.startsWith("image/") &&
                !archivo.type.startsWith("video/")
            ) {

                document.getElementById("errorEvidencia").textContent =
                    "El archivo debe ser una fotografía o un vídeo.";

                formularioValido = false;
            }
        }

        // Resultado
        if (formularioValido) {

            alert("Avistamiento registrado correctamente.");

            formAvistamiento.reset();

        }

    });
}


// ==========================================
// LISTADO DE AVISTAMIENTOS
// ==========================================

const tablaAvistamientos = document.getElementById("tablaAvistamientos");

if (tablaAvistamientos) {

    // Datos ficticios para el prototipo
    const avistamientos = [

        {
            ave: "Cóndor",
            tipo: "rapaz",
            lugar: "Cajón del Maipo",
            fecha: "2026-08-20",
            hora: "10:30",
            voluntario: "María González"
        },

        {
            ave: "Pelícano",
            tipo: "marina",
            lugar: "Valparaíso",
            fecha: "2026-08-18",
            hora: "15:20",
            voluntario: "Juan Pérez"
        },

        {
            ave: "Flamenco chileno",
            tipo: "acuática",
            lugar: "San Pedro de Atacama",
            fecha: "2026-08-15",
            hora: "09:10",
            voluntario: "Camila Soto"
        },

        {
            ave: "Tenca",
            tipo: "terrestre",
            lugar: "Santiago",
            fecha: "2026-08-12",
            hora: "11:45",
            voluntario: "María González"
        },

        {
            ave: "Gaviota dominicana",
            tipo: "marina",
            lugar: "Viña del Mar",
            fecha: "2026-08-10",
            hora: "13:00",
            voluntario: "Juan Pérez"
        },

        {
            ave: "Chincol",
            tipo: "urbana",
            lugar: "Ñuñoa",
            fecha: "2026-08-08",
            hora: "08:20",
            voluntario: "Camila Soto"
        },

        {
            ave: "Halcón peregrino",
            tipo: "rapaz",
            lugar: "Concepción",
            fecha: "2026-08-05",
            hora: "17:30",
            voluntario: "María González"
        },

        {
            ave: "Zorzal",
            tipo: "terrestre",
            lugar: "Temuco",
            fecha: "2026-08-03",
            hora: "12:15",
            voluntario: "Juan Pérez"
        },

        {
            ave: "Cisne de cuello negro",
            tipo: "acuática",
            lugar: "Valdivia",
            fecha: "2026-07-30",
            hora: "14:40",
            voluntario: "Camila Soto"
        },

        {
            ave: "Golondrina",
            tipo: "migratoria",
            lugar: "La Serena",
            fecha: "2026-07-28",
            hora: "16:10",
            voluntario: "María González"
        },

        {
            ave: "Loica",
            tipo: "terrestre",
            lugar: "Talca",
            fecha: "2026-07-25",
            hora: "10:00",
            voluntario: "Juan Pérez"
        },

        {
            ave: "Pato jergón",
            tipo: "acuática",
            lugar: "Puerto Varas",
            fecha: "2026-07-22",
            hora: "09:30",
            voluntario: "Camila Soto"
        }
    ];


    let resultados = [...avistamientos];

    let pagina = 1;

    const elementosPorPagina = 5;

    const filtroTipo = document.getElementById("filtroTipo");

    const ordenarPor = document.getElementById("ordenarPor");

    const aplicarFiltros = document.getElementById("aplicarFiltros");

    const paginaAnterior = document.getElementById("paginaAnterior");

    const paginaSiguiente = document.getElementById("paginaSiguiente");

    const paginaActual = document.getElementById("paginaActual");


    // Mostrar los datos en la tabla
    function mostrarAvistamientos() {

        tablaAvistamientos.innerHTML = "";

        const inicio = (pagina - 1) * elementosPorPagina;

        const fin = inicio + elementosPorPagina;

        const avistamientosPagina = resultados.slice(inicio, fin);


        avistamientosPagina.forEach(function (avistamiento) {

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${avistamiento.ave}</td>
                <td>${obtenerNombreTipo(avistamiento.tipo)}</td>
                <td>${avistamiento.lugar}</td>
                <td>${formatearFecha(avistamiento.fecha)}</td>
                <td>${avistamiento.hora}</td>
                <td>${avistamiento.voluntario}</td>
            `;

            tablaAvistamientos.appendChild(fila);

        });


        const totalPaginas = Math.ceil(
            resultados.length / elementosPorPagina
        );

        paginaActual.textContent =
            "Página " + pagina + " de " + totalPaginas;

        paginaAnterior.disabled = pagina === 1;

        paginaSiguiente.disabled =
            pagina === totalPaginas;

    }


    // Aplicar filtro y orden
    aplicarFiltros.addEventListener("click", function () {

        const tipoSeleccionado = filtroTipo.value;

        const ordenSeleccionado = ordenarPor.value;


        // Filtrar por tipo
        if (tipoSeleccionado === "todos") {

            resultados = [...avistamientos];

        } else {

            resultados = avistamientos.filter(function (avistamiento) {

                return avistamiento.tipo === tipoSeleccionado;

            });

        }


        // Ordenar por fecha
        if (ordenSeleccionado === "fecha-desc") {

            resultados.sort(function (a, b) {

                return new Date(b.fecha) - new Date(a.fecha);

            });

        } else if (ordenSeleccionado === "fecha-asc") {

            resultados.sort(function (a, b) {

                return new Date(a.fecha) - new Date(b.fecha);

            });

        }


        // Ordenar por lugar
        else if (ordenSeleccionado === "lugar-asc") {

            resultados.sort(function (a, b) {

                return a.lugar.localeCompare(b.lugar);

            });

        } else if (ordenSeleccionado === "lugar-desc") {

            resultados.sort(function (a, b) {

                return b.lugar.localeCompare(a.lugar);

            });

        }


        pagina = 1;

        mostrarAvistamientos();

    });


    // Página anterior
    paginaAnterior.addEventListener("click", function () {

        if (pagina > 1) {

            pagina--;

            mostrarAvistamientos();

        }

    });


    // Página siguiente
    paginaSiguiente.addEventListener("click", function () {

        const totalPaginas = Math.ceil(
            resultados.length / elementosPorPagina
        );

        if (pagina < totalPaginas) {

            pagina++;

            mostrarAvistamientos();

        }

    });


    // Convertir tipo interno a nombre visible
    function obtenerNombreTipo(tipo) {

        const nombres = {

            rapaz: "Ave rapaz",
            marina: "Ave marina",
            acuática: "Ave acuática",
            terrestre: "Ave terrestre",
            urbana: "Ave urbana",
            migratoria: "Ave migratoria"

        };

        return nombres[tipo] || "Otro";

    }


    // Formatear fecha
    function formatearFecha(fecha) {

        const partes = fecha.split("-");

        return partes[2] + "/" + partes[1] + "/" + partes[0];

    }


    // Mostrar tabla al cargar la página
    mostrarAvistamientos();

}