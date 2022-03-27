// Variables
const carrito = document.querySelector('#carrito');
const listaSabores = document.querySelector('#lista-sabores');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const finalizarCompra = document.querySelector('.boton__confirmar');
let articulosCarrito = [];




// Listeners
cargarEventListeners();

function cargarEventListeners() {
    // Dispara cuando se presiona "Agregar"
    listaSabores.addEventListener('click', agregarSabor);

    // Cuando se elimina un sabor del carrito
    carrito.addEventListener('click', eliminarSabor);

    // Al Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

    // Confirmar pedido
    finalizarCompra.addEventListener('click', confirmarPedido);

    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || []  ;
        carritoHTML();
   });
}




// Funciones
// Función que añade el sabor al carrito
function agregarSabor(e) {

    e.preventDefault();
    // Delegation para agregar-carrito
    if(e.target.classList.contains('agregar-carrito')) {
        const saborSeleccionado = e.target;
        // Enviamos el sabor seleccionado para tomar sus datos
        leerDatosSabor(saborSeleccionado);
    }
}

// Lee los datos del sabor seleccionado
// function leerDatosSabor(sabor) {
//     const infoSabor = {
//         imagen: sabor.querySelector('img').src,
//         titulo: sabor.querySelector('h3').textContent,
//         precio: sabor.querySelector('.precio').textContent,
//         id: sabor.querySelector('a').getAttribute('data-id'), 
//         cantidad: 1
//     }
    
//     if( articulosCarrito.some( sabor => sabor.id === infoSabor.id ) ) { 
//             const sabores = articulosCarrito.map( sabor => {
//                 if( sabor.id === infoSabor.id ) {
//                     sabor.cantidad++;
//                     return sabor;
//                  } else {
//                     return sabor;
//                 }
//             })
//             articulosCarrito = [...sabores];
//     }   else {
//             articulosCarrito = [...articulosCarrito, infoSabor];
//     }
//     carritoHTML();
// }
function leerDatosSabor(sabor) {
    const IDSaborJSON = sabor.getAttribute('data-id');
    const url = '/data/datos.json'
    fetch(url)
       .then (respuesta => respuesta.json())
       .then (resultado => {
           const infoSabor = resultado[IDSaborJSON]
           infoSabor.id = IDSaborJSON
           if( articulosCarrito.some( sabor => sabor.id === infoSabor.id ) ) { 
               const sabores = articulosCarrito.map( sabor => {
                   if( sabor.id === infoSabor.id ) {
                       sabor.cantidad++;
                       return sabor;
                    } else {
                       return sabor;
                   }
               })
               articulosCarrito = [...sabores];
       }   else {
               articulosCarrito = [...articulosCarrito, infoSabor];
       }
       carritoHTML();})    
}


// Elimina elemento del carrito en el DOM
function eliminarSabor(e) {
    e.preventDefault();
    if(e.target.classList.contains('borrar-sabor') ) {
        const saborId = e.target.getAttribute('data-id')
          
        // Eliminar del arreglo del carrito
        articulosCarrito = articulosCarrito.filter(sabor => sabor.id !== saborId);

        carritoHTML();
    }
}


// Muestra el sabor seleccionado en el carrito
function carritoHTML() {

    limpiarHTML();

    articulosCarrito.forEach(sabor => {
        const {imagen, titulo, precio, cantidad, id} = sabor;
        const row = document.createElement('tr');
        row.innerHTML = `
               <td><img src="${imagen}" width=75></td>
               <td>${titulo}</td>
               <td class="prize">$${precio}</td>
               <td>${cantidad}</td>
               <td><a href="#" class="button__carrito borrar-sabor boton__vaciar" data-id="${id}">X</a></td>`;
        contenedorCarrito.appendChild(row);
    });
    console.log(articulosCarrito)
    totalCheckout();
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina elementos repetidos en el DOM
function limpiarHTML() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

// Vaciar carrito
function vaciarCarrito () {
    articulosCarrito = [];
    totalCheckout();
    limpiarHTML();
    sincronizarStorage();
}

//Calculo del costo total
function totalCheckout () {
    let costoProducto = 0;
    const totalCarrito = [];
    for (let producto of articulosCarrito) {
        costoProducto = parseInt(producto.precio)*parseInt(producto.cantidad);
        totalCarrito.push(costoProducto);
    }
    const checkout = totalCarrito.reduce((a , b) => a + b, 0);
    console.log(checkout)
    document.querySelector('.total__carrito').textContent = `TOTAL: $${checkout}`;
}

//Confirmacion del pedido y mensajes de alerta
function confirmarPedido () {
    if (articulosCarrito.length == 0) {
        swal({
            title: "Carrito vacio!",
            text: "Agregue elementos para realizar su pedido",
            icon: "error",
        });
    } else {
        swal({
            title: "Hemos recibido su pedido!",
            text: "Lo enviaremos lo más pronto posible!",
            icon: "success",
        });
    }
    vaciarCarrito();
}

