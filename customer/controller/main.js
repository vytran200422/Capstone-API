const products = [];
const gsap = window.gsap;
// Functions hiện sản phẩm ra trang chủ
function displayProduct(product) {
  const menuItemDiv = document.createElement("div");
  menuItemDiv.classList.add(
    "item",
    "col-lg-3",
    "col-md-4",
    "col-sm-6",
    "product-item"
  );
  menuItemDiv.setAttribute("data-product-name", product.name);
  const productImage = document.createElement("img");
  productImage.src = product.img;
  productImage.alt = product.name;
  menuItemDiv.appendChild(productImage);

  const productName = document.createElement("h2");
  productName.textContent = product.name;
  menuItemDiv.appendChild(productName);

  const productPrice = document.createElement("span");
  productPrice.textContent = "Price: " + formatCurrency(product.price);
  menuItemDiv.appendChild(productPrice);

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("product-buttons");

  const addToCartButton = document.createElement("button");
  addToCartButton.textContent = "Thêm vào giỏ hàng";
  addToCartButton.classList.add("btn-add", "btn-primary");
  addToCartButton.addEventListener("click", () => {
    addToCart(product);
  });
  buttonDiv.appendChild(addToCartButton);

  menuItemDiv.appendChild(buttonDiv);
  const menuDiv = document.querySelector(".menu-item");
  menuDiv.appendChild(menuItemDiv);
}
const cart = {
  products: [],
  getTotalQuantity() {
    return this.products.reduce(
      (total, product) => total + product.quantity,
      0
    );
  },
};

// bắt sự kiện dropdown
const selectPhone = document.getElementById("selectPhone");
selectPhone.addEventListener("change", function () {
  const selectedValue = this.value;
  console.log(selectedValue);
  displayProductsByName(selectedValue);
});

// Hàm hiển thị sản phẩm của dropdown
function displayProductsByName(productName) {
  const menuItems = document.querySelectorAll(".menu-item .item");

  menuItems.forEach((item) => {
    const productNameAttribute = item.getAttribute("data-product-name");

    if (productName === "All" || productNameAttribute.includes(productName)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

function updateCartIcon() {
  const cartIcon = document.querySelector(".cart-icon");
  const cartQuantity = document.querySelector(".cart-quantity");
  const cartQuantityToggler = document.getElementById("cartQuantityToggler"); // Get the toggler cart quantity element

  const totalQuantity = cart.getTotalQuantity();

  cartQuantity.textContent = totalQuantity;
  cartQuantityToggler.textContent = totalQuantity; // Update the toggler cart quantity

  if (totalQuantity > 0) {
    cartQuantity.style.display = "block";
    cartQuantityToggler.style.display = "inline-block"; // Show the toggler cart quantity
  } else {
    cartQuantity.style.display = "none";
    cartQuantityToggler.style.display = "none"; // Hide the toggler cart quantity
  }
}

// Functions thêm sản phẩm vào giỏ hàng
function addToCart(product) {
  const existingProduct = cart.products.find((p) => p.id === product.id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.products.push({ ...product, quantity: 1 });
  }
  saveCartToLocalStorage(cart.products);
  updateCartIcon();
}
function saveCartToLocalStorage(cartItems) {
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

// Lấy dữ liệu sản phẩm từ api
async function displayProductsFromApi() {
  try {
    const response = await apiGetProducts();

    if (response.status === 200) {
      const products = response.data;

      products.forEach((product) => {
        displayProduct(product);
      });
    } else {
      console.log("Failed to fetch products from API.");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}
// thêm sản phẩm vào giỏ hàng
function showModal() {
  if (!Array.isArray(cart.products)) {
    return;
  }

  const modal = document.querySelector(".modal");
  const cartItems = document.querySelector(".cart-items");

  cartItems.innerHTML = "";

  cart.products.forEach((product) => {
    if (product.quantity > 0) {
      const productDiv = document.createElement("div");
      productDiv.classList.add("cart-item");

      const productDeleteButton = document.createElement("button");
      productDeleteButton.textContent = "X";
      productDeleteButton.classList.add("btn", "btn-danger", "btnn-remove");
      productDiv.appendChild(productDeleteButton);
      productDeleteButton.addEventListener("click", () => {
        removeFromCart(product);
        showModal();
        updateProductQuantityOnCard;
      });

      const productImage = document.createElement("img");
      productImage.src = product.img;
      productDiv.appendChild(productImage);

      const productName = document.createElement("h2");
      productName.textContent = product.name;
      productDiv.appendChild(productName);

      const productPrice = document.createElement("p");
      productPrice.textContent = "Giá: " + formatCurrency(product.price);
      productDiv.appendChild(productPrice);

      const productQuantity = document.createElement("p");
      productQuantity.textContent = "Số lượng: " + product.quantity;
      productDiv.appendChild(productQuantity);

      cartItems.appendChild(productDiv);

      const decreaseButton = document.createElement("button");
      decreaseButton.textContent = "-";
      decreaseButton.classList.add("quantity-button");
      decreaseButton.addEventListener("click", () => {
        decreaseQuantity(product);
        showModal();
      });
      productDiv.appendChild(decreaseButton);

      const increaseButton = document.createElement("button");
      increaseButton.textContent = "+";
      increaseButton.classList.add("quantity-button");
      increaseButton.addEventListener("click", () => {
        increaseQuantity(product);
        showModal();
      });
      productDiv.appendChild(increaseButton);
    }
  });

  const totalPrice = calculateTotalPrice();
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total-div");
  totalDiv.textContent = "Tổng giá trị đơn hàng: " + formatCurrency(totalPrice);
  cartItems.appendChild(totalDiv);

  gsap.to(modal, {
    duration: 0.3,
    opacity: 1,
    scale: 1,
    ease: "easeInOut",
  });
  modal.classList.add("active");
}
// hàm tính tổng tiển
function calculateTotalPrice() {
  let totalPrice = 0;

  cart.products.forEach((product) => {
    totalPrice += product.price * product.quantity;
  });

  return totalPrice;
}

// Loại bỏ sản phẩm ra khỏi giỏ hảng
function removeFromCart(product) {
  const existingProduct = cart.products.find((p) => p.id === product.id);
  cart.products = cart.products.filter((p) => p.id !== product.id);
  saveCartToLocalStorage(cart.products);
  updateCartIcon();
}
//Cập nhật lại cart count khi xóa bỏ sản phẩm ra khỏi giỏ hàng
function updateProductQuantityOnCard(product) {
  const cardProduct = document.querySelector(
    `[data-product-id="${product.id}"]`
  );
  const cardProductQuantity = cardProduct.querySelector(".product-quantity");
  cardProductQuantity.textContent = "Số lượng: " + product.quantity;
}

// Nút tăng số lượng sản phẩm
function increaseQuantity(product) {
  const existingProduct = cart.products.find((p) => p.id === product.id);

  if (existingProduct) {
    existingProduct.quantity++;
    saveCartToLocalStorage(cart.products);
  }
}
//Nút giảm số lượng sản phẩm
function decreaseQuantity(product) {
  const existingProduct = cart.products.find((p) => p.id === product.id);

  if (existingProduct) {
    existingProduct.quantity--;
    if (existingProduct.quantity < 1) {
      cart.products = cart.products.filter((p) => p.id !== product.id);
    }
    saveCartToLocalStorage(cart.products);
    if (cart.products.length === 0) {
      hideModal();
    }
  }
  updateCartIcon();
}

// Nút đóng modal
document.addEventListener("DOMContentLoaded", () => {
  const btnClose = document.getElementById("btn-close");
  btnClose.addEventListener("click", () => {
    console.log("Button close is clicked");
    hideModal();
  });
});
//Show modal giỏ hàng
document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.querySelector(".cart-icon");
  cartIcon.addEventListener("click", () => {
    showModal(cart.products);
  });
});
// Nút thanh toán
document.getElementById("btn-checkout").onclick = () => {
  const total = calculateTotalPrice();
  if (total > 0) {
    Swal.fire({
      icon: "success",
      title: "Thanh toán thành công!",
      text: "Số tiền thanh toán: $" + total,
    });
    checkOut();
  } else {
    Swal.fire({
      icon: "warning",
      title: "Thanh toán không thành công!",
      text: "Bạn chưa có sản phẩm nào trong giỏ hàng",
    });
  }
  hideModal();
};
function checkOut() {
  cart.products.forEach((product) => {
    product.quantity = 0;
  });
  updateCartIcon();

  showModal();
}

//Tạm ẩn modal giỏ hàng
function hideModal() {
  const modal = document.querySelector(".modal");

  gsap.to(modal, {
    duration: 0.3,
    opacity: 0,
    scale: 0.8,
    ease: "easeInOut",
    onComplete: () => {
      modal.classList.remove("active");
    },
  });
}
function checkLocalStorage() {
  const cartItems = JSON.parse(localStorage.getItem("cart"));
  if (cartItems && Array.isArray(cartItems)) {
    cart.products = cartItems;
    updateCartIcon();
  }
}
const navLinks = document.querySelectorAll(".nav-link");

const navbarCollapse = document.querySelector(".navbar-collapse");

function closeNavbarCollapse() {
  if (navbarCollapse.classList.contains("show")) {
    navbarCollapse.classList.remove("show");
  }
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.getAttribute("href");
    document.querySelector(targetId).scrollIntoView({ behavior: "smooth" });
    closeNavbarCollapse();
  });
});
document.addEventListener("DOMContentLoaded", function () {
  window.onscroll = function () {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      document.getElementById("backToTopBtn").style.display = "block";
    } else {
      document.getElementById("backToTopBtn").style.display = "none";
    }
  };
});

// Hàm cuộn lên đầu trang
function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
function formatCurrency(number) {
  return number
    .toLocaleString("en-US", { style: "currency", currency: "USD" })
    .slice(0, -3);
}
window.addEventListener("resize", () => {
  if (window.innerWidth < 768) {
    updateCartIcon();
  }
});
window.onload = () => {
  checkLocalStorage();
  displayProductsFromApi();
  displayProductsByName("All");
};