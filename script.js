// Estado inicial del carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Referencias al DOM
const carritoDiv = document.getElementById("carrito");
const totalDiv = document.getElementById("total");
const main = document.querySelector("main");

// Función para renderizar los productos dinámicamente
async function cargarProductos() {
    try {
        const respuesta = await fetch("./productos.json");
        const categorias = await respuesta.json();

        categorias.forEach((categoria) => {
            const section = document.createElement("section");
            section.classList.add("mb-5");

            let html = `
                <h2 class="text-dark contenedor">${categoria.categoria}:</h2>
                <div class="row">
            `;

            categoria.productos.forEach((producto) => {
                html += `
                    <div class="col-12 col-md-4 text-center">
                        <div class="text-dark contenedor">
                            <h3>${producto.nombre}</h3>
                            <h3>$${producto.precio}</h3>
                        </div>
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid mb-3">
                        <button class="btn btn-dark agregar-btn">Agregar al carrito</button>
                    </div>
                `;
            });

            html += `</div>`;
            section.innerHTML = html;
            main.insertBefore(section, main.lastElementChild); // Insertar antes del carrito
        });

        agregarEventosBotones(); // Asociar eventos
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// Función para agregar eventos a botones de agregar al carrito
function agregarEventosBotones() {
    const botonesAgregar = document.querySelectorAll(".agregar-btn");
    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

// Función para agregar un producto al carrito
function agregarAlCarrito(e) {
    const card = e.target.closest(".col-12");
    const nombre = card.querySelector("h3").innerText;
    const precio = parseFloat(card.querySelector("h3:nth-of-type(2)").innerText.replace("$", ""));

    const productoExistente = carrito.find((item) => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    guardarCarrito();
    renderizarCarrito();

    // SweetAlert: Confirmación al agregar
    Swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: `${nombre} se agregó al carrito.`,
        timer: 2000,
        showConfirmButton: false,
    });
}

// Función para renderizar el carrito
function renderizarCarrito() {
    carritoDiv.innerHTML = ""; // Vaciar el contenido previo

    if (carrito.length === 0) {
        carritoDiv.innerHTML = "<p>El carrito está vacío.</p>";
        totalDiv.innerText = "$0";
        return;
    }

    carrito.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("item-carrito");

        div.innerHTML = `
            <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad}</p>
            <button class="btn btn-danger btn-sm eliminar-btn">Eliminar</button>
        `;

        div.querySelector(".eliminar-btn").addEventListener("click", () => eliminarProducto(producto.nombre));
        carritoDiv.appendChild(div);
    });

    totalDiv.innerText = `$${calcularTotal()}`;
}

// Función para eliminar un producto del carrito
function eliminarProducto(nombre) {
    carrito = carrito.filter((producto) => producto.nombre !== nombre);
    guardarCarrito();
    renderizarCarrito();

    // SweetAlert: Confirmación al eliminar
    Swal.fire({
        icon: "info",
        title: "Producto eliminado",
        text: `${nombre} fue eliminado del carrito.`,
        timer: 2000,
        showConfirmButton: false,
    });
}

// Función para vaciar todo el carrito
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();

    // SweetAlert: Confirmación al vaciar el carrito
    Swal.fire({
        icon: "warning",
        title: "Carrito vacío",
        text: "Se eliminaron todos los productos del carrito.",
        timer: 2000,
        showConfirmButton: false,
    });
}

// Función para calcular el total del carrito
function calcularTotal() {
    return carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
}

// Función para guardar el carrito en LocalStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Inicialización
cargarProductos(); // Cargar productos dinámicamente
renderizarCarrito(); // Renderizar carrito al cargar la página
