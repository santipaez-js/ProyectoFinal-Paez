// Estado inicial del carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Referencias al DOM
const carritoDiv = document.getElementById("carrito");
const totalDiv = document.getElementById("total");
const botonesAgregar = document.querySelectorAll(".agregar-btn");

// Función para renderizar el carrito
function renderizarCarrito() {
    carritoDiv.innerHTML = ""; // Limpiar contenido previo

    if (carrito.length === 0) {
        carritoDiv.innerHTML = `<p class="text-muted">El carrito está vacío.</p>`;
        totalDiv.innerHTML = "";
        return;
    }

    // Crear tabla de productos
    const tabla = document.createElement("table");
    tabla.className = "table table-striped table-hover";

    let contenidoTabla = `
      <thead>
        <tr>
          <th>#</th>
          <th>Producto</th>
          <th>Precio</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
    `;

    let total = 0;

    carrito.forEach((producto, index) => {
        const { nombre, precio } = producto; // Desestructuración
        contenidoTabla += `
          <tr>
            <td>${index + 1}</td>
            <td>${nombre}</td>
            <td>$${precio}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">
                Eliminar
              </button>
            </td>
          </tr>
        `;
        total += precio; // Sumar al total
    });

    contenidoTabla += "</tbody>";
    tabla.innerHTML = contenidoTabla;
    carritoDiv.appendChild(tabla);

    // Mostrar total
    totalDiv.innerHTML = `<h5>Total: $${total.toFixed(2)}</h5>`;
}

// Función para agregar productos al carrito
function agregarAlCarrito(e) {
    const card = e.target.closest(".text-center");
    const nombre = card.querySelector("h3").innerText;
    const precioTexto = card.querySelector("h3:nth-of-type(2)").innerText;
    const precio = parseFloat(precioTexto.replace("$", "")); // Convertir a número

    // Agregar producto al carrito
    carrito.push({ nombre, precio });
    localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardar en storage
    renderizarCarrito(); // Actualizar visualización
}

// Función para eliminar un producto
function eliminarProducto(index) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este producto será eliminado del carrito.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.splice(index, 1); // Quitar del carrito
            localStorage.setItem("carrito", JSON.stringify(carrito)); // Actualizar storage
            renderizarCarrito(); // Actualizar visualización
            Swal.fire({
                icon: 'success',
                title: 'Producto eliminado',
                text: 'El producto fue eliminado del carrito.',
            });
        }
    });
}

// Función para vaciar el carrito
function vaciarCarrito() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'El carrito ya está vacío',
            text: 'No hay productos para eliminar.',
        });
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se eliminarán todos los productos del carrito.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = []; // Vaciar array
            localStorage.removeItem("carrito"); // Limpiar storage
            renderizarCarrito(); // Actualizar visualización
            Swal.fire({
                icon: 'success',
                title: 'Carrito vaciado',
                text: 'Todos los productos fueron eliminados.',
            });
        }
    });
}

// Agregar eventos a los botones de agregar al carrito
botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito);
});

// Renderizar carrito al cargar la página
renderizarCarrito();
