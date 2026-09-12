const state = {
  view: "dashboard",
  category: "All",
  query: "",
  payment: "Cash",
  discount: 0,
  tax: 0.1,
  cart: [],
  settings: { storeId: 1, storeName: "StyleHub Store", currency: "USD", taxRate: 0.1 },
  categoriesData: [
    { id: 1, name: "T-Shirts" }, { id: 2, name: "Shirts" }, { id: 3, name: "Pants" },
    { id: 4, name: "Dresses" }, { id: 5, name: "Jackets" }, { id: 6, name: "Shoes" }
  ],
  variants: [
    { id: 1, productId: 1, size: "M", color: "White", sku: "TEE-WHT-M" },
    { id: 2, productId: 2, size: "M", color: "Blue", sku: "SHR-BLU-M" },
    { id: 3, productId: 3, size: "32", color: "Khaki", sku: "PNT-KHA-32" }
  ],
  inventory: [
    { id: 1, variantId: 1, quantity: 42, reorderPoint: 10 },
    { id: 2, variantId: 2, quantity: 8, reorderPoint: 10 },
    { id: 3, variantId: 3, quantity: 24, reorderPoint: 10 }
  ],
  customers: [
    { id: 1, name: "Alex Morgan" }, { id: 2, name: "Sophia Carter" },
    { id: 3, name: "Michael Chen" }, { id: 4, name: "Walk-in customer" }
  ],
  employees: [{ id: 1, name: "Jamie Doe", role: "Administrator" }, { id: 2, name: "Taylor Smith", role: "Cashier" }],
  suppliers: [{ id: 1, name: "Urban Apparel Co." }, { id: 2, name: "Shoe House Ltd." }],
  purchaseOrders: [{ id: "PO-1007", supplierId: 1, status: "Received", total: 840 }],
  expensesData: [{ id: 1, category: "Rent", amount: 1200 }, { id: 2, category: "Utilities", amount: 185 }],
  orderItems: [],
  payments: [],
  products: [
    { id: 1, categoryId: 1, name: "Classic Cotton Tee", category: "T-Shirts", price: 18, stock: 42, icon: "👕" },
    { id: 2, categoryId: 2, name: "Oxford Button Shirt", category: "Shirts", price: 32, stock: 8, icon: "👔" },
    { id: 3, categoryId: 3, name: "Relaxed Chino Pants", category: "Pants", price: 45, stock: 24, icon: "👖" },
    { id: 4, categoryId: 4, name: "Summer Midi Dress", category: "Dresses", price: 59, stock: 5, icon: "👗" },
    { id: 5, categoryId: 5, name: "Lightweight Bomber", category: "Jackets", price: 78, stock: 16, icon: "🧥" },
    { id: 6, categoryId: 6, name: "Canvas Low Sneakers", category: "Shoes", price: 64, stock: 0, icon: "👟" },
    { id: 7, categoryId: 2, name: "Linen Resort Shirt", category: "Shirts", price: 38, stock: 12, icon: "👕" },
    { id: 8, categoryId: 3, name: "Everyday Joggers", category: "Pants", price: 35, stock: 19, icon: "🩳" }
  ],
  orders: [
    { id: "SP-1048", customer: "Alex Morgan", date: "Today, 10:42 AM", amount: 126, status: "Completed" },
    { id: "SP-1047", customer: "Walk-in customer", date: "Today, 09:18 AM", amount: 64, status: "Completed" },
    { id: "SP-1046", customer: "Sophia Carter", date: "Yesterday, 04:35 PM", amount: 218, status: "Pending" },
    { id: "SP-1045", customer: "Michael Chen", date: "Yesterday, 02:11 PM", amount: 92, status: "Completed" }
  ]
};

const $ = (selector) => document.querySelector(selector);
const money = (value) => `$${value.toFixed(2)}`;
const categories = ["All", "T-Shirts", "Shirts", "Pants", "Dresses", "Jackets", "Shoes"];

function getCategory(product) {
  return state.categoriesData.find(category => category.id === product.categoryId);
}

function getProductInventory(productId) {
  const variantIds = state.variants.filter(variant => variant.productId === productId).map(variant => variant.id);
  return state.inventory.filter(stock => variantIds.includes(stock.variantId));
}

function syncProductStock(productId) {
  const product = state.products.find(item => item.id === productId);
  if (product) product.stock = getProductInventory(productId).reduce((total, stock) => total + stock.quantity, 0) || product.stock;
}

function addPayment(orderId, amount, method) {
  state.payments.push({ id: state.payments.length + 1, orderId, amount, method, status: "Paid" });
}

function render() {
  const view = views[state.view] || views.dashboard;
  $("#app").innerHTML = view();
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.querySelector('.nav-item[data-view="pos"] .nav-badge');
  if (cartBadge) cartBadge.textContent = cartCount;
  $(".nav-item.active")?.classList.remove("active");
  $(`.nav-item[data-view="${state.view}"]`)?.classList.add("active");
  $("#page-title").textContent = view.title;
  $("#breadcrumb-parent").textContent = state.view === "dashboard" ? "Workspace" : "Management";
  bindViewEvents();
}

const shell = (title, subtitle, content, action = "") => `
  <div class="page-heading"><div><h1>${title}</h1><p>${subtitle}</p></div><div class="actions">${action}</div></div>
  ${content}`;

function metric(label, value, icon, trend, down = false) {
  return `<article class="metric"><div class="metric-top"><span>${label}</span><span class="metric-icon">${icon}</span></div><strong>${value}</strong><small class="trend ${down ? "down" : ""}">${down ? "↓" : "↑"} ${trend}<span>vs last month</span></small></article>`;
}

const views = {
  dashboard: Object.assign(() => shell("Good morning, Jamie 👋", "Here’s what’s happening with your store today.", `
    <section class="metrics">${metric("Today's revenue", "$1,284.50", "↗", "12.8%")}${metric("Today's orders", "24", "▤", "8.2%")}${metric("Products sold", "68", "▣", "4.6%")}${metric("Low stock items", "3", "!", "2 need attention", true)}</section>
    <section class="dashboard-grid"><article class="panel"><div class="panel-header"><h2>Sales overview</h2><select class="filter"><option>Last 7 days</option><option>Last 30 days</option></select></div><div class="chart">${[55,72,47,82,66,91,76].map((height, i) => `<div class="bar-group"><div class="bar ${i === 6 ? "current" : ""}" style="height:${height}%"></div><small>${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</small></div>`).join("")}</div><div class="legend"><span><i class="current"></i>This week</span><span><i></i>Last week</span></div></article><article class="panel"><div class="panel-header"><h2>Recent sales</h2><a href="#" data-view-link="orders">View all</a></div><div class="sale-list">${state.orders.slice(0, 4).map(order => `<div class="sale-row"><span class="sale-avatar">▤</span><span><strong>${order.id}</strong><small>${order.customer} · ${order.date}</small></span><strong>${money(order.amount)}</strong></div>`).join("")}</div></article></section>
    <section class="panel" style="margin-top:20px"><div class="panel-header"><h2>Inventory alerts</h2><a href="#" data-view-link="inventory">View inventory</a></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Product</th><th>Category</th><th>Current stock</th><th>Status</th><th>Action</th></tr></thead><tbody>${state.products.filter(p => p.stock <= 8).map(p => `<tr><td><strong>${p.icon} &nbsp;${p.name}</strong></td><td>${p.category}</td><td>${p.stock}</td><td><span class="status ${p.stock ? "low-stock" : "out-stock"}">${p.stock ? "Low stock" : "Out of stock"}</span></td><td><button class="button" data-view-link="inventory">Adjust stock</button></td></tr>`).join("")}</tbody></table></div></section>
  `, `<button class="button" data-view-link="reports">↓ Export report</button><button class="button primary" data-view-link="pos">+ New sale</button>`), { title: "Dashboard" }),

  pos: Object.assign(() => shell("New sale", "Select products to add them to the current order.", `<div class="pos-layout"><section><div class="toolbar"><div class="search-box">⌕<input id="product-search" placeholder="Search products..." value="${state.query}"></div><button class="button">▤ Scan barcode</button></div><div class="category-list">${categories.map(c => `<button class="category ${state.category === c ? "active" : ""}" data-category="${c}">${c}</button>`).join("")}</div><div class="product-grid">${filteredProducts().map(productCard).join("") || `<div class="empty"><strong>No products found</strong>Try another search or category.</div>`}</div></section>${cartMarkup()}</div>`), { title: "POS / New Sale" }),

  products: Object.assign(() => shell("Products", "Manage your catalog, variants, and pricing.", `<div class="toolbar"><div class="search-box">⌕<input placeholder="Search products..." data-table-search></div><button class="button primary" data-action="add-product">+ Add product</button></div><section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead><tbody>${state.products.map(p => `<tr><td><strong>${p.icon} &nbsp;${p.name}</strong></td><td>${p.category}</td><td>${money(p.price)}</td><td>${p.stock}</td><td><span class="status ${p.stock === 0 ? "out-stock" : p.stock < 10 ? "low-stock" : "in-stock"}">${p.stock === 0 ? "Out of stock" : p.stock < 10 ? "Low stock" : "In stock"}</span></td><td><button class="button" data-action="edit-product" data-id="${p.id}">Edit</button></td></tr>`).join("")}</tbody></table></div></section>`), { title: "Products" }),

  inventory: Object.assign(() => shell("Inventory", "Monitor stock levels and make adjustments.", `<section class="metrics">${metric("Total products", state.products.length, "▣", "6.4%")}${metric("In stock", state.products.filter(p => p.stock > 8).length, "✓", "3.1%")}${metric("Low stock", state.products.filter(p => p.stock > 0 && p.stock <= 8).length, "!", "Needs attention", true)}${metric("Out of stock", state.products.filter(p => p.stock === 0).length, "×", "1 item", true)}</section><section class="panel"><div class="panel-header"><h2>Stock overview</h2><button class="button primary" data-action="adjust-stock">+ Stock adjustment</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Product</th><th>SKU</th><th>Stock level</th><th>Reorder point</th><th>Status</th></tr></thead><tbody>${state.products.map(p => `<tr><td><strong>${p.icon} &nbsp;${p.name}</strong></td><td>SKU-${String(p.id).padStart(4, "0")}</td><td style="min-width:170px"><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span>${p.stock} units</span><small>${Math.min(p.stock * 2, 100)}%</small></div><div class="stock-bar"><span class="${p.stock < 10 ? "low" : ""}" style="width:${Math.min(p.stock * 2, 100)}%"></span></div></td><td>10 units</td><td><span class="status ${p.stock === 0 ? "out-stock" : p.stock < 10 ? "low-stock" : "in-stock"}">${p.stock === 0 ? "Out of stock" : p.stock < 10 ? "Low stock" : "In stock"}</span></td></tr>`).join("")}</tbody></table></div></section>`), { title: "Inventory" }),

  orders: Object.assign(() => shell("Orders", "Review sales, payments, and order status.", `<section class="panel"><div class="toolbar"><div class="search-box">⌕<input placeholder="Search order or customer..." data-table-search></div><select class="filter"><option>All statuses</option><option>Completed</option><option>Pending</option><option>Cancelled</option></select></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>${state.orders.map(o => `<tr><td><strong>${o.id}</strong></td><td>${o.customer}</td><td>${o.date}</td><td><strong>${money(o.amount)}</strong></td><td><span class="status ${o.status.toLowerCase()}">${o.status}</span></td><td><button class="button">View details</button></td></tr>`).join("")}</tbody></table></div></section>`), { title: "Orders" }),

  categories: Object.assign(() => simpleManagement("Categories", "Organize products into easy-to-browse collections.", ["T-Shirts", "Shirts", "Pants", "Dresses", "Jackets", "Shoes"], "Products")),
  customers: Object.assign(() => simpleManagement("Customers", "Keep track of customer relationships and purchase history.", ["Alex Morgan", "Sophia Carter", "Michael Chen", "Walk-in customer"], "Purchases")),
  suppliers: Object.assign(() => simpleManagement("Suppliers", "Manage supplier contacts and purchase orders.", ["Urban Apparel Co.", "Shoe House Ltd.", "Textile Partners"], "Purchase orders")),
  employees: Object.assign(() => simpleManagement("Employees", "Manage your team, roles, and permissions.", ["Jamie Doe · Administrator", "Taylor Smith · Cashier", "Morgan Lee · Manager"], "Permissions")),
  expenses: Object.assign(() => simpleManagement("Expenses", "Track operating costs and expense history.", ["Rent", "Utilities", "Supplies", "Marketing"], "Expense history")),
  reports: Object.assign(() => simpleManagement("Reports", "Understand sales, products, inventory, and profit.", ["Sales report", "Product report", "Inventory report", "Customer report", "Profit & Loss"], "View report")),
  settings: Object.assign(() => simpleManagement("Settings", "Configure your store, receipt, payment methods, and security.", ["Store settings", "General", "Notifications", "Receipt", "Payment methods", "Security"], "Configure"), { title: "Settings" })
};

function simpleManagement(title, subtitle, entries, action) {
  return shell(title, subtitle, `<div class="info-grid">${entries.map((entry, i) => `<article class="panel info-card"><h3>${["▣", "◈", "⚙", "▤", "◒", "♙"][i % 6]} &nbsp;${entry}</h3><p>Review and manage ${entry.toLowerCase()} for your store from one place.</p><button class="button">${action} →</button></article>`).join("")}</div>`, `<button class="button primary">+ Add ${title.slice(0, -1).toLowerCase()}</button>`);
}

function filteredProducts() {
  return state.products.filter(p => (state.category === "All" || p.category === state.category) && p.name.toLowerCase().includes(state.query.toLowerCase()));
}
function productCard(product) {
  return `<article class="product-card" data-product="${product.id}" ${product.stock === 0 ? "aria-disabled=true" : ""}><div class="product-image">${product.icon}</div><div class="product-card-body"><h3>${product.name}</h3><p>${product.category} · ${product.stock} in stock</p><div class="product-price">${money(product.price)}<small>${product.stock ? "+ Add" : "Sold out"}</small></div></div></article>`;
}
function cartMarkup() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = (subtotal - state.discount) * state.tax;
  const total = subtotal - state.discount + tax;
  return `<aside class="panel cart"><div class="panel-header"><h2>Current order</h2><button class="button" data-action="clear-cart">Clear</button></div><div class="cart-items">${state.cart.length ? state.cart.map(item => `<div class="cart-row"><span class="sale-avatar">${item.icon}</span><div><strong>${item.name}</strong><small>${money(item.price)} each</small><div class="quantity"><button data-quantity="-1" data-id="${item.id}">−</button><span>${item.quantity}</span><button data-quantity="1" data-id="${item.id}">+</button></div></div><strong>${money(item.price * item.quantity)}</strong></div>`).join("") : `<div class="empty"><strong>Your cart is empty</strong>Add a product to start a new sale.</div>`}</div><div class="summary"><div class="summary-line"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="summary-line"><span>Discount <button class="button" style="padding:2px 5px;font-size:10px" data-action="discount">Add</button></span><strong>-${money(state.discount)}</strong></div><div class="summary-line"><span>Tax (10%)</span><strong>${money(tax)}</strong></div><div class="summary-line total"><span>Total</span><strong>${money(total)}</strong></div><p style="margin:19px 0 7px;font-size:11px;color:var(--muted)">Payment method</p><div class="payment-options">${["Cash", "QR Payment", "Card", "Other"].map(method => `<button class="payment-option ${state.payment === method ? "active" : ""}" data-payment="${method}">${method}</button>`).join("")}</div><button class="button primary full" data-action="complete-sale" ${state.cart.length ? "" : "disabled"}>Complete sale · ${money(total)}</button></div></aside>`;
}

function addToCart(id) {
  const product = state.products.find(item => item.id === id);
  if (!product || product.stock === 0) return;
  const item = state.cart.find(entry => entry.id === id);
  if (item && item.quantity >= product.stock) return showToast("No more stock available");
  item ? item.quantity++ : state.cart.push({ ...product, quantity: 1 });
  render();
}
function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}
function bindViewEvents() {
  document.querySelectorAll("[data-view-link]").forEach(el => el.addEventListener("click", e => { e.preventDefault(); state.view = el.dataset.viewLink; render(); }));
  document.querySelectorAll("[data-category]").forEach(el => el.addEventListener("click", () => { state.category = el.dataset.category; render(); }));
  document.querySelectorAll("[data-product]").forEach(el => el.addEventListener("click", () => addToCart(Number(el.dataset.product))));
  document.querySelectorAll("[data-payment]").forEach(el => el.addEventListener("click", () => { state.payment = el.dataset.payment; render(); }));
  document.querySelectorAll("[data-quantity]").forEach(el => el.addEventListener("click", () => {
    const item = state.cart.find(entry => entry.id === Number(el.dataset.id));
    if (item) { item.quantity += Number(el.dataset.quantity); if (item.quantity < 1) state.cart = state.cart.filter(entry => entry.id !== item.id); render(); }
  }));
  $("#product-search")?.addEventListener("input", e => { state.query = e.target.value; render(); $("#product-search")?.focus(); });
  document.querySelector("[data-action=clear-cart]")?.addEventListener("click", () => { state.cart = []; render(); });
  document.querySelector("[data-action=discount]")?.addEventListener("click", () => { state.discount = state.discount ? 0 : 10; render(); });
  document.querySelector("[data-action=complete-sale]")?.addEventListener("click", () => {
    const orderId = `SP-${1049 + state.orders.length}`;
    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0) - state.discount;
    state.cart.forEach(item => {
      const product = state.products.find(p => p.id === item.id);
      const stockRows = getProductInventory(item.id);
      if (stockRows.length) {
        stockRows[0].quantity = Math.max(0, stockRows[0].quantity - item.quantity);
        syncProductStock(item.id);
      } else if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
      state.orderItems.push({ id: state.orderItems.length + 1, orderId, productId: item.id, quantity: item.quantity, unitPrice: item.price });
    });
    state.orders.unshift({ id: orderId, customerId: 4, customer: "Walk-in customer", date: "Just now", amount: total * 1.1, status: "Completed", employeeId: 1 });
    addPayment(orderId, total * 1.1, state.payment);
    state.cart = []; state.discount = 0; state.view = "orders"; render(); showToast("Sale completed successfully");
  });
  document.querySelectorAll("[data-action=add-product], [data-action=edit-product], [data-action=adjust-stock]").forEach(el => el.addEventListener("click", () => showToast("This management form is ready for the next step")));
}

document.querySelectorAll(".nav-item").forEach(item => item.addEventListener("click", () => { state.view = item.dataset.view; render(); $("#sidebar").classList.remove("open"); }));
$("#mobile-menu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
$("#global-search").addEventListener("click", () => { state.view = "products"; render(); document.querySelector("[data-table-search]")?.focus(); });
render();
