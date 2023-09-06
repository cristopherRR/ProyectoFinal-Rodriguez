/*funcion pestaña del carrito*/
function showCart(x){
    document.getElementById("products-id").style.display = "block";
}
function closeBtn(){
    document.getElementById("products-id").style.display = "none";
}


if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", mostrarProductos)
}else{
    mostrarProductos();
}

fetch("./js/productos.json")
    .then(products => products.json())
    .then(data => {
        productos = data;
        mostrarProductos(productos);
    })

    const cardProduct = document.querySelector("#card-Productos");
    let añadirCarritoBoton = document.querySelectorAll('.productoAgregar');

//odernar todos los productos en el div

function mostrarProductos(todosLosProductos) {
    todosLosProductos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
        <img class="card-img-top" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="card-info">
                <h3 class="text-title">${producto.titulo}</h3>
            </div>
            <div class="card-footer">
                <span class="text-title precio">$${producto.precio}</span>
                <button class="productoAgregar" id="${producto.id}"><svg class="svg-icon" viewBox="0 0 20 20">
                <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
            </svg></button>
            </div>
        </div>
        `;
        cardProduct.append(div);
    })
    añadirProductosCarrito();
}

//buscador de productos

document.addEventListener("keyup", e => {
    if (e.target.matches("#buscador")) {
        const searchTerm = e.target.value.toUpperCase();
        const cardProductos = document.querySelectorAll(".card");

        cardProductos.forEach(ropa => {
            const ropaText = ropa.textContent.toUpperCase();
            ropa.style.display = ropaText.includes(searchTerm) ? "grid" : "none";
        });
    }
});

//implementacion del producto en el carrito 
function añadirProductosCarrito() {
    añadirCarritoBoton = document.querySelectorAll(".productoAgregar");
    añadirCarritoBoton.forEach((addboton) => {
        addboton.addEventListener('click', addToCartClicked);
    });
}

let itemsCard = JSON.parse(localStorage.getItem('itemsCard')) || [];

function addToCartClicked(event) {
    const Boton = event.currentTarget.id;;
    const productoAgregado = productos.find(producto => producto.id === Boton);
    
    if(itemsCard.some(producto => producto.id === Boton)) {
        const index = itemsCard.findIndex(producto => producto.id === Boton);
        itemsCard[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        itemsCard.push(productoAgregado);
    }
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Se agrego el producto al carrito',
        showConfirmButton: false,
        timer: 900
    })
    
    localStorage.setItem("itemsCard", JSON.stringify(itemsCard));
    sumaPrecio()
    cargaProductos()
}

const verifivarButton = document.querySelector('.verifivarButton');
verifivarButton.addEventListener('click', verificarButtonClick);

const contenedorCarritoProductos = document.querySelector("#contenderCarritos");
let botonesEliminar = document.querySelectorAll(".buttonDelete");

function cargaProductos() {
    if (itemsCard) {          
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoProductos.innerHTML = "";
        itemsCard.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("item");
            div.innerHTML = `
            <img src="${producto.imagen}" class="card-img-top" alt="...">
            <div class="content">
                <div class="name itemName">${producto.titulo}</div>
                <div class="price">
                ${producto.precio}</div>
            </div>
            <div class="quantity">
                <button id="${producto.id}" class="btn btn-danger buttonDelete" type="button">X</button>
                </div>
            </div>
        </div>`;
            contenedorCarritoProductos.append(div);
        });
    
    } else{
        contenedorCarritoProductos.classList.add("disabled");
    }
    sumaPrecio()
    actualizarBotonesEliminar();
}

cargaProductos();

//calculo y suma de todos los productos seleccionados 
function sumaPrecio() {
    let total = 0;
    const precioTotal = document.querySelector('.precioTotal');
    const itemTotals = document.querySelectorAll('.item');

    itemTotals.forEach((itemTotal) => {
        const compraItemPrecio = itemTotal.querySelector('.price');
        const price = Number(compraItemPrecio.textContent.replace('$', ' '));

        
        total = total + price;
    });
    precioTotal.innerHTML = `${total.toFixed(2)}`;

    localStorage.setItem("itemsCard", JSON.stringify(itemsCard))
}

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".buttonDelete");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}


//eliminar producto del carrito 
function eliminarDelCarrito(event) {
    const Boton = event.currentTarget.id;
    const index = itemsCard.findIndex(producto => producto.id === Boton);
    itemsCard.splice(index,1);
    sumaPrecio()
    cargaProductos();
    localStorage.setItem("itemsCard", JSON.stringify(itemsCard))
}

function quantityChanged(event) {
    const input = event.target;
    if (input.value <= 0) {
        input.value = 1;
    }

    sumaPrecio()
}

//vaciar todo el carrito y culminar compra
function verificarButtonClick() {
    contenedorCarritoProductos.innerHTML = " ";

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Redireccionando...',
        showConfirmButton: false,
        timer: 1500
    })
    localStorage.removeItem("itemsCard", JSON.stringify(itemsCard));
    sumaPrecio()
}
