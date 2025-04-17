document.addEventListener('DOMContentLoaded', function() {

  // Elementos del DOM
  const cartBtn = document.getElementById('cart-btn'); // Botón para abrir el carrito
  const cartOverlay = document.querySelector('.cart-overlay'); // Contenedor del carrito
  const closeCartBtn = document.querySelector('.close-cart'); // Botón para cerrar carrito
  const cartItemsContainer = document.querySelector('.cart-items'); // Contenedor de los productos del carrito
  const totalPriceElement = document.querySelector('.total-price'); // Elemento para mostrar el precio total
  const addToCartBtns = document.querySelectorAll('.add-to-cart'); // Botones para agregar al carrito
  const checkoutBtn = document.querySelector('.checkout-btn'); // Botón para finalizar compra

  // Recuperar el carrito del localStorage o iniciar vacío
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Función para renderizar los productos del carrito
  function renderCart() {
    cartItemsContainer.innerHTML = ''; // Limpiar contenido previo
    let total = 0;

    // Recorrer cada producto en el carrito
    cart.forEach(item => {
      const cartItemElement = document.createElement('div');
      cartItemElement.classList.add('cart-item');

      // Estructura del producto + botón "X" para eliminar
      cartItemElement.innerHTML = `
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.title}</h4>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          <p class="cart-item-quantity">Cantidad: ${item.quantity}</p>
        </div>
        <button class="remove-item" data-title="${item.title}">X</button>
      `;

      cartItemsContainer.appendChild(cartItemElement);
      total += item.price * item.quantity;
    });

    // Mostrar el total
    totalPriceElement.textContent = `$${total.toFixed(2)}`;

    // Guardar carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Escuchar clics en los botones "X" para eliminar productos
    const removeBtns = cartItemsContainer.querySelectorAll('.remove-item');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const titleToRemove = btn.getAttribute('data-title'); // Título del producto a eliminar
        cart = cart.filter(item => item.title !== titleToRemove); // Eliminar del carrito
        renderCart(); // Volver a renderizar el carrito
      });
    });
  }

  // Abrir el carrito al hacer clic en el botón
  cartBtn.addEventListener('click', function(e) {
    e.preventDefault();
    cartOverlay.classList.add('show');
    renderCart();
  });

  // Cerrar el carrito con el botón de cerrar
  closeCartBtn.addEventListener('click', function() {
    cartOverlay.classList.remove('show');
  });

  // Cerrar el carrito si se hace clic fuera del contenido
  cartOverlay.addEventListener('click', function(e) {
    if (e.target === cartOverlay) {
      cartOverlay.classList.remove('show');
    }
  });

  // Agregar productos al carrito
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const productCard = e.target.closest('.product-card'); // Buscar la tarjeta del producto
      if (!productCard) return;

      // Obtener datos del producto
      const title = productCard.querySelector('.product-title').textContent;
      const price = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));

      // Revisar si ya está en el carrito
      const existingItem = cart.find(item => item.title === title);
      if (existingItem) {
        existingItem.quantity += 1; // Aumentar cantidad
      } else {
        cart.push({ title, price, quantity: 1 }); // Agregar nuevo producto
      }

      renderCart(); // Actualizar carrito visualmente

      // Feedback visual de "¡Agregado!"
      const originalText = e.target.textContent;
      e.target.textContent = '¡Agregado!';
      setTimeout(() => {
        e.target.textContent = originalText;
      }, 1000);
    });
  });

  // Finalizar la compra
  checkoutBtn.addEventListener('click', function(e) {
    e.preventDefault();

    // Verificar si hay productos
    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    // Preparar datos del carrito
    const carrito = cart.map(item => ({
      titulo: item.title,
      precio: item.price,
      cantidad: item.quantity
    }));

    // Calcular total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    // Crear formulario para enviar los datos
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/comprar';

    const carritoInput = document.createElement('input');
    carritoInput.type = 'hidden';
    carritoInput.name = 'carrito';
    carritoInput.value = JSON.stringify(carrito);

    const totalInput = document.createElement('input');
    totalInput.type = 'hidden';
    totalInput.name = 'grantotal';
    totalInput.value = total.toFixed(2);

    form.appendChild(carritoInput);
    form.appendChild(totalInput);
    document.body.appendChild(form);

    // Vaciar carrito después de comprar
    cart = [];
    localStorage.removeItem('cart');
    renderCart();

    // Enviar formulario
    form.submit();
  });

  // Renderizar carrito al cargar la página
  renderCart();
});
