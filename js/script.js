/* General: shared functions used by the pages. */
'use strict';

const CART_KEY = 'shoqan-cart-v1';
const WISHLIST_KEY = 'shoqan-wishlist-v1';

function money(value) {
  return value.toLocaleString('en-US') + ' ₸';
}

function getProduct(id) {
  for (const product of products) {
    if (product.id === id) return product;
  }
}

function defaultSize(product) {
  if (product.sizes.includes('M')) return 'M';
  return product.sizes[0];
}

function defaultColor(product) {
  if (product.colors.includes('Navy')) return 'Navy';
  return product.colors[0];
}

/* Browser storage: keep the cart and wishlist after a page reload. */
function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // The current page still works if browser storage is blocked.
  }
}

function parseArray(value) {
  try {
    const items = JSON.parse(value);
    if (Array.isArray(items)) return items;
  } catch (error) {
    // Invalid saved text is treated as an empty list.
  }
  return [];
}

function cleanCart(items) {
  const validItems = [];
  for (const item of items) {
    if (!item) continue;
    const product = getProduct(item.id);
    if (!product) continue;

    let size = item.size;
    let color = item.color;
    let quantity = item.quantity;
    if (!product.sizes.includes(size)) size = product.sizes[0];
    if (!product.colors.includes(color)) color = defaultColor(product);
    if (!Number.isInteger(quantity)) quantity = 1;
    if (quantity < 1) quantity = 1;
    if (quantity > 99) quantity = 99;

    validItems.push({ id: product.id, size: size, color: color, quantity: quantity });
  }
  return validItems;
}

let cart = [];
const savedCart = readStorage(CART_KEY);
if (savedCart === null) {
  // Add three sample items only on the first visit. Empty carts stay empty.
  cart = [
    { id: 'classic-wool-suit', size: 'M', color: 'Navy', quantity: 1 },
    { id: 'oxford-cotton-shirt', size: 'M', color: 'White', quantity: 1 },
    { id: 'tailored-trousers', size: 'M', color: 'Grey', quantity: 1 }
  ];
  writeStorage(CART_KEY, cart);
} else {
  cart = cleanCart(parseArray(savedCart));
}

const wishlist = [];
for (const id of parseArray(readStorage(WISHLIST_KEY))) {
  if (getProduct(id)) wishlist.push(id);
}
let promoApplied = false;
let noticeTimer;

/* Product cards and cart buttons. The three grids use the same card markup. */
function announce(message) {
  const notice = document.getElementById('site-toast');
  notice.textContent = message;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(function () {
    notice.textContent = '';
  }, 3500);
}

function updateCartCount() {
  let count = 0;
  for (const item of cart) count += item.quantity;
  for (const element of document.querySelectorAll('[data-cart-count]')) {
    element.textContent = count;
  }
}

function saveCart() {
  writeStorage(CART_KEY, cart);
  updateCartCount();
}

function addToCart(product, size, color, quantity) {
  let existingItem;
  for (const item of cart) {
    if (item.id === product.id && item.size === size && item.color === color) {
      existingItem = item;
      break;
    }
  }

  if (existingItem) {
    if (existingItem.quantity + quantity > 99) {
      announce('A maximum of 99 items is allowed for each product option.');
      return false;
    }
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: product.id, size: size, color: color, quantity: quantity });
  }
  saveCart();
  renderCart();
  announce(product.name + ' added to your cart.');
  return true;
}

function productCard(product) {
  let badge = '';
  if (product.badge) {
    badge = '<span class="product-badge">' + product.badge + '</span>';
  }
  return `<article class="product-card">
    <a class="product-image" href="product.html?id=${product.id}" aria-label="View ${product.name}">
      <img src="images/products/${product.image}" alt="${imageAlt[product.image]}" width="600" height="560" loading="lazy">
      ${badge}
    </a>
    <div class="product-card-body">
      <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
      <p class="price">${money(product.price)}</p>
      <button type="button" class="btn btn-dark" data-add-product="${product.id}" aria-label="Add ${product.name} to cart">Add to cart</button>
    </div>
  </article>`;
}

function renderCards(targetId, list) {
  const target = document.getElementById(targetId);
  if (!target) return;
  let html = '';
  for (const product of list) html += productCard(product);
  target.innerHTML = html;
}

document.addEventListener('click', function (event) {
  const button = event.target.closest('[data-add-product]');
  if (!button) return;
  const product = getProduct(button.dataset.addProduct);
  addToCart(product, defaultSize(product), defaultColor(product), 1);
});

/* Catalog */
// A product matches when it has at least one of the checked sizes or colors.
function matchesOptions(selectedOptions, productOptions) {
  if (selectedOptions.length === 0) return true;
  for (const option of selectedOptions) {
    if (productOptions.includes(option)) return true;
  }
  return false;
}

function setupCatalog() {
  const grid = document.getElementById('catalog-products');
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const filterForm = document.getElementById('filter-form');
  const sortSelect = document.getElementById('catalog-sort');
  const count = document.getElementById('catalog-count');
  const pagination = document.getElementById('catalog-pagination');
  const note = document.getElementById('catalog-search-note');
  const priceRange = document.getElementById('price-range');
  const priceOutput = document.getElementById('price-output');
  const search = (params.get('q') || '').trim();
  let categories = [];
  let sizes = [];
  let colors = [];
  let maxPrice = 250000;
  let page = Math.max(1, parseInt(params.get('page'), 10) || 1);
  const perPage = 9;

  if (params.get('category')) categories.push(params.get('category'));
  for (const input of filterForm.querySelectorAll('[name="category"]')) {
    input.checked = categories.includes(input.value);
  }
  document.querySelector('input[name="q"]').value = search;

  function renderCatalog() {
    const matching = [];
    for (const product of products) {
      const productText = (product.name + ' ' + product.category).toLowerCase();
      if (!productText.includes(search.toLowerCase())) continue;
      if (categories.length > 0 && !categories.includes(product.category)) continue;
      if (!matchesOptions(sizes, product.sizes)) continue;
      if (!matchesOptions(colors, product.colors)) continue;
      if (product.price > maxPrice) continue;
      matching.push(product);
    }

    if (sortSelect.value === 'price-low') {
      matching.sort(function (a, b) { return a.price - b.price; });
    }
    if (sortSelect.value === 'price-high') {
      matching.sort(function (a, b) { return b.price - a.price; });
    }
    if (sortSelect.value === 'name') {
      matching.sort(function (a, b) { return a.name.localeCompare(b.name); });
    }

    const pages = Math.ceil(matching.length / perPage);
    page = Math.min(page, pages || 1);
    const start = (page - 1) * perPage;
    const end = Math.min(start + perPage, matching.length);
    renderCards('catalog-products', matching.slice(start, end));
    count.textContent = `Showing ${start + 1}–${end} of ${matching.length} pieces`;
    if (matching.length === 0) {
      count.textContent = 'No matching pieces';
      grid.innerHTML = '<div class="catalog-empty"><h2>No pieces found</h2><p>Try a higher price limit, fewer filters, or another search.</p><a class="btn btn-outline-dark" href="catalog.html">View all products</a></div>';
    }

    note.hidden = !search && !categories.includes('Accessories');
    note.textContent = 'Accessories collection · select a category or reset filters to explore more.';
    if (search) note.textContent = `Search results for “${search}”`;

    let buttons = '';
    for (let number = 1; number <= pages; number++) {
      let activeClass = '';
      let currentPage = '';
      if (number === page) {
        activeClass = ' active';
        currentPage = ' aria-current="page"';
      }
      buttons += `<li class="page-item${activeClass}"><button class="page-link" type="button" data-catalog-page="${number}" aria-label="Page ${number}"${currentPage}>${number}</button></li>`;
    }
    pagination.innerHTML = buttons;
  }

  priceRange.addEventListener('input', function () {
    priceOutput.textContent = money(Number(priceRange.value));
  });
  filterForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(filterForm);
    categories = data.getAll('category');
    sizes = data.getAll('size');
    colors = data.getAll('color');
    maxPrice = Number(data.get('price'));
    page = 1;
    renderCatalog();
  });
  filterForm.addEventListener('reset', function () {
    categories = [];
    sizes = [];
    colors = [];
    maxPrice = 250000;
    page = 1;
    // Wait for the browser's reset before clearing URL-preselected checkboxes.
    setTimeout(function () {
      for (const input of filterForm.querySelectorAll('input[type="checkbox"]')) {
        input.checked = false;
      }
      priceRange.value = 250000;
      priceOutput.textContent = money(250000);
      renderCatalog();
    }, 0);
  });
  sortSelect.addEventListener('change', function () {
    page = 1;
    renderCatalog();
  });
  pagination.addEventListener('click', function (event) {
    const button = event.target.closest('[data-catalog-page]');
    if (!button) return;
    page = Number(button.dataset.catalogPage);
    renderCatalog();
    count.scrollIntoView({ block: 'start' });
  });
  renderCatalog();
}

/* Product */
// Size buttons, color buttons and thumbnails all use the same selected state.
function selectButton(buttons, selectedButton) {
  for (const button of buttons) {
    const selected = button === selectedButton;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', selected);
  }
}

function productImageDescription(product, view) {
  if (view === 'full') return imageAlt[product.image];
  const viewName = view[0].toUpperCase() + view.slice(1);
  return viewName + ' detail crop of the same photograph. ' + imageAlt[product.image];
}

function setupProduct() {
  const form = document.getElementById('product-form');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const product = getProduct(params.get('id')) || products[0];
  const mainImage = document.getElementById('product-main-image');
  const sizeButtons = document.querySelectorAll('[data-size]');
  const colorButtons = document.querySelectorAll('[data-color]');
  const thumbnails = document.querySelectorAll('.thumbnail-button');
  const colorLabel = document.getElementById('selected-color');
  const quantityInput = document.getElementById('product-quantity');
  const feedback = document.getElementById('product-feedback');
  const wishlistButton = document.getElementById('wishlist-button');
  let selectedSize = defaultSize(product);
  let selectedColor = defaultColor(product);

  document.title = product.name + ' | SHOQAN';
  document.getElementById('product-title').textContent = product.name;
  document.getElementById('product-breadcrumb').textContent = product.name;
  document.getElementById('product-category').textContent = product.category + ' · The classic collection';
  document.getElementById('product-price').textContent = money(product.price);
  const oldPrice = document.getElementById('product-old-price');
  oldPrice.textContent = '';
  oldPrice.hidden = !product.oldPrice;
  if (product.oldPrice) oldPrice.textContent = money(product.oldPrice);

  let description = product.description;
  if (!description) {
    description = `${product.name} brings a considered fit and a classic finish to your wardrobe. Part of our ${product.category.toLowerCase()} collection, it is designed to combine easily with the rest of the SHOQAN range.`;
  }
  document.getElementById('product-description-text').textContent = description;
  mainImage.src = 'images/products/' + product.image;
  mainImage.alt = imageAlt[product.image];

  for (const button of sizeButtons) {
    button.disabled = !product.sizes.includes(button.dataset.size);
    button.classList.toggle('selected', button.dataset.size === selectedSize);
    button.setAttribute('aria-pressed', button.dataset.size === selectedSize);
    button.addEventListener('click', function () {
      selectedSize = button.dataset.size;
      selectButton(sizeButtons, button);
    });
  }
  for (let index = 0; index < colorButtons.length; index++) {
    const button = colorButtons[index];
    const color = product.colors[index];
    button.dataset.color = color;
    button.className = 'color-swatch color-' + color.toLowerCase();
    button.setAttribute('aria-label', color);
    button.title = color;
    button.classList.toggle('selected', color === selectedColor);
    button.setAttribute('aria-pressed', color === selectedColor);
    button.addEventListener('click', function () {
      selectedColor = color;
      colorLabel.textContent = color;
      selectButton(colorButtons, button);
    });
  }
  colorLabel.textContent = selectedColor;

  for (const button of thumbnails) {
    const image = button.querySelector('img');
    image.src = 'images/products/' + product.image;
    image.alt = productImageDescription(product, button.dataset.view);
    button.addEventListener('click', function () {
      selectButton(thumbnails, button);
      mainImage.parentElement.dataset.view = button.dataset.view;
      mainImage.alt = productImageDescription(product, button.dataset.view);
    });
  }
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const quantity = Number(quantityInput.value);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      feedback.textContent = 'Choose a whole quantity between 1 and 99.';
      quantityInput.focus();
      return;
    }
    if (addToCart(product, selectedSize, selectedColor, quantity)) {
      feedback.textContent = `${quantity} × ${product.name} · ${selectedSize} · ${selectedColor} added to your cart.`;
    }
  });

  function updateWishlistButton() {
    const saved = wishlist.includes(product.id);
    wishlistButton.textContent = 'Wishlist';
    if (saved) wishlistButton.textContent = 'Saved to wishlist';
    wishlistButton.setAttribute('aria-pressed', saved);
  }
  wishlistButton.addEventListener('click', function () {
    if (wishlist.includes(product.id)) {
      // Remove every copy in case an older saved list contains duplicates.
      for (let index = wishlist.length - 1; index >= 0; index--) {
        if (wishlist[index] === product.id) wishlist.splice(index, 1);
      }
      announce('Removed from your wishlist.');
    } else {
      wishlist.push(product.id);
      announce('Saved to your wishlist on this browser.');
    }
    writeStorage(WISHLIST_KEY, wishlist);
    updateWishlistButton();
  });
  updateWishlistButton();

  const related = [];
  for (const item of products) {
    if (item.id !== product.id) related.push(item);
    if (related.length === 4) break;
  }
  renderCards('related-products', related);
}

/* Cart */
function cartTotals() {
  let subtotal = 0;
  for (const item of cart) {
    subtotal += getProduct(item.id).price * item.quantity;
  }
  const deliverySelect = document.getElementById('delivery-method');
  let method = 'standard';
  if (deliverySelect) method = deliverySelect.value;

  let delivery = 2500;
  if (subtotal >= 100000 || method === 'pickup') delivery = 0;
  if (method === 'express') delivery = 5000;
  if (cart.length === 0) delivery = 0;

  let discount = 0;
  if (promoApplied) discount = Math.round(subtotal * 0.1);
  return {
    subtotal: subtotal,
    delivery: delivery,
    discount: discount,
    total: subtotal + delivery - discount
  };
}

function updateTotals() {
  if (!document.getElementById('cart-total')) return;
  const totals = cartTotals();
  let deliveryText = 'Free';
  let discountText = money(0);
  if (totals.delivery > 0) deliveryText = money(totals.delivery);
  if (totals.discount > 0) discountText = '−' + money(totals.discount);
  document.getElementById('cart-subtotal').textContent = money(totals.subtotal);
  document.getElementById('cart-delivery').textContent = deliveryText;
  document.getElementById('cart-discount').textContent = discountText;
  document.getElementById('cart-total').textContent = money(totals.total);
  document.getElementById('proceed-checkout').disabled = cart.length === 0;
  document.querySelector('#checkout-form [type="submit"]').disabled = cart.length === 0;
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  if (!cartItems) return;
  let rows = '';
  for (let index = 0; index < cart.length; index++) {
    const item = cart[index];
    const product = getProduct(item.id);
    rows += `<tr class="cart-row">
      <td class="cart-product"><img src="images/products/${product.image}" alt="${imageAlt[product.image]}" width="96" height="96"><div><a href="product.html?id=${product.id}">${product.name}</a><small>${item.color}</small></div></td>
      <td class="cart-size" data-label="Size">${item.size}</td>
      <td class="cart-quantity" data-label="Quantity"><input class="form-control" type="number" min="1" max="99" step="1" value="${item.quantity}" data-cart-quantity="${index}" aria-label="Quantity of ${product.name}"></td>
      <td class="cart-price" data-label="Price">${money(product.price * item.quantity)}</td>
      <td class="cart-remove"><button type="button" class="remove-button" data-cart-remove="${index}" aria-label="Remove ${product.name} from cart">×</button></td>
    </tr>`;
  }
  cartItems.innerHTML = rows;
  document.getElementById('cart-empty').hidden = cart.length > 0;
  updateTotals();
}

function setupCart() {
  const cartItems = document.getElementById('cart-items');
  if (!cartItems) return;
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutFeedback = document.getElementById('checkout-feedback');
  const promoCode = document.getElementById('promo-code');
  const promoFeedback = document.getElementById('promo-feedback');

  cartItems.addEventListener('change', function (event) {
    const input = event.target.closest('[data-cart-quantity]');
    if (!input) return;
    const item = cart[Number(input.dataset.cartQuantity)];
    const quantity = Number(input.value);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      input.value = item.quantity;
      announce('Quantity must be a whole number between 1 and 99.');
      return;
    }
    item.quantity = quantity;
    saveCart();
    input.closest('tr').querySelector('.cart-price').textContent = money(getProduct(item.id).price * quantity);
    updateTotals();
  });
  cartItems.addEventListener('click', function (event) {
    const button = event.target.closest('[data-cart-remove]');
    if (!button) return;
    const index = Number(button.dataset.cartRemove);
    const name = getProduct(cart[index].id).name;
    cart.splice(index, 1);
    saveCart();
    renderCart();
    announce(name + ' removed from your cart.');
    const nextButton = cartItems.querySelector('[data-cart-remove]');
    if (nextButton) nextButton.focus();
  });
  document.getElementById('promo-form').addEventListener('submit', function (event) {
    event.preventDefault();
    promoApplied = promoCode.value.trim().toUpperCase() === 'SHOQAN10';
    promoFeedback.textContent = 'Code not recognised. Try SHOQAN10 for 10% off.';
    if (promoApplied) {
      promoFeedback.textContent = 'SHOQAN10 applied: 10% off the product subtotal.';
    }
    updateTotals();
  });
  document.getElementById('delivery-method').addEventListener('change', updateTotals);
  document.getElementById('proceed-checkout').addEventListener('click', function () {
    if (cart.length === 0) return;
    checkoutForm.scrollIntoView({ block: 'start' });
    checkoutForm.elements.fullName.focus({ preventScroll: true });
  });

  /* Checkout: show a local confirmation without sending or saving form values. */
  checkoutForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!checkoutForm.reportValidity()) return;
    if (cart.length === 0) {
      checkoutFeedback.textContent = 'Add a product to your cart before placing a demo order.';
      return;
    }
    const totals = cartTotals();
    const confirmation = document.getElementById('order-confirmation');
    const reference = 'SHQ-' + Date.now().toString().slice(-6);
    confirmation.innerHTML = `<h2>Thank you. Your demo order is complete.</h2><p>Reference <strong>${reference}</strong> · Total <strong>${money(totals.total)}</strong></p><p>This is a university project demonstration. No payment was taken, no order was sent, and your checkout details were not saved.</p><a class="btn btn-dark" href="catalog.html">Continue shopping</a>`;
    confirmation.hidden = false;
    cart = [];
    promoApplied = false;
    saveCart();
    renderCart();
    checkoutForm.reset();
    checkoutFeedback.textContent = '';
    promoFeedback.textContent = '';
    promoCode.value = '';
    confirmation.scrollIntoView({ block: 'center' });
    confirmation.focus({ preventScroll: true });
  });
}

window.addEventListener('storage', function (event) {
  if (event.key === CART_KEY) {
    cart = cleanCart(parseArray(event.newValue));
    updateCartCount();
    renderCart();
  }
});

/* Forms: HTML checks required fields and email addresses. */
function setupDemoForm(formId, feedbackId, message) {
  const form = document.getElementById(formId);
  if (!form) return;
  const feedback = document.getElementById(feedbackId);
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    feedback.textContent = message;
    form.reset();
  });
}

/* Header and mobile menu */
const menuButton = document.getElementById('menu-toggle');
const menu = document.getElementById('header-menu');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
}

menuButton.addEventListener('click', function () {
  menu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', menu.classList.contains('is-open'));
});
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') closeMenu();
});
window.addEventListener('resize', function () {
  if (window.innerWidth >= 992) closeMenu();
});

/* Product accordions use the local Bootstrap file loaded by each HTML page. */
function openAccordionFromHash() {
  const panel = document.getElementById(window.location.hash.slice(1));
  if (!panel || !panel.classList.contains('accordion-collapse')) return;

  function scrollToPanel() {
    panel.closest('.accordion-item').scrollIntoView({ block: 'start' });
  }
  if (panel.classList.contains('show')) {
    scrollToPanel();
  } else {
    panel.addEventListener('shown.bs.collapse', scrollToPanel, { once: true });
    bootstrap.Collapse.getOrCreateInstance(panel, { toggle: false }).show();
  }
}
window.addEventListener('hashchange', openAccordionFromHash);

/* Footer information dialog */
const information = {
  delivery: ['Delivery', 'Standard delivery costs 2,500 ₸ and is free for a product subtotal of at least 100,000 ₸. Express delivery costs 5,000 ₸. Store pickup is free. These are demonstration rates.'],
  returns: ['Returns', 'Our demonstration returns policy allows unworn items with their original labels to be returned within 14 days. No real purchases are processed by this student project.'],
  size: ['Size guide', 'See the Size guide accordion on any product page for chest, waist and sleeve measurements in centimetres. Choose the larger size if you are between sizes.'],
  careers: ['Careers', 'SHOQAN is a university demonstration brand. There are no open positions or recruitment services associated with this project.'],
  privacy: ['Privacy', 'Cart contents and wishlist product IDs are stored only in this browser using localStorage. Contact, newsletter, account and checkout form values are not saved or submitted. This site does not process real payments.'],
  terms: ['Terms and conditions', 'This is an educational storefront. Products, prices, delivery, returns and checkout are demonstrations. Placing an order creates a local confirmation only; no purchase agreement or payment is created.'],
  cookies: ['Cookies', 'This project does not set its own cookies or use analytics. It uses browser localStorage for the shopping cart and wishlist. Bootstrap files are loaded from a public CDN when an internet connection is available.'],
  instagram: ['Instagram', 'The SHOQAN social profile is planned. This demonstration does not link to an unaffiliated account.'],
  facebook: ['Facebook', 'The SHOQAN social profile is planned. This demonstration does not link to an unaffiliated account.'],
  pinterest: ['Pinterest', 'The SHOQAN social profile is planned. This demonstration does not link to an unaffiliated account.']
};
const infoDialog = document.getElementById('info-dialog');
document.addEventListener('click', function (event) {
  const button = event.target.closest('[data-info]');
  if (!button) return;
  const content = information[button.dataset.info];
  document.getElementById('info-dialog-title').textContent = content[0];
  document.getElementById('info-dialog-text').textContent = content[1];
  if (!infoDialog.open) infoDialog.showModal();
});
document.querySelector('[data-dialog-close]').addEventListener('click', function () {
  infoDialog.close();
});
infoDialog.addEventListener('click', function (event) {
  if (event.target === infoDialog) infoDialog.close();
});

/* Start the parts needed on the current page. */
renderCards('new-arrivals', products.slice(0, 4));
setupCatalog();
setupProduct();
setupCart();
renderCart();
updateCartCount();
openAccordionFromHash();

setupDemoForm('newsletter-form', 'newsletter-feedback', 'Thank you. Your email passed validation. This demo does not send subscriptions or save your email.');
setupDemoForm('contact-form', 'contact-feedback', 'Your message passed validation. This demo does not send messages or save your contact details.');
setupDemoForm('login-form', 'login-feedback', 'Your sign-in form passed validation. Account authentication is not connected in this demo; your password was not saved.');
setupDemoForm('register-form', 'register-feedback', 'Your registration form passed validation. No account was created and your password was not saved.');
