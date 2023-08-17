getProducts();

function getProducts() {
  apiGetProducts()
    .then((response) => {
      // Gọi hàm display để hiển thị ra giao diện
      display(response.data);
      // console.log(response.data)
    })
    .catch((error) => {
      console.log(error);
    });
}

function createProduct() {
  // DOM và khởi tạo object product
  let product = {
    name: getElement("#TenSP").value,
    price: +getElement("#GiaSP").value,
    screen: getElement("#ScreenSP").value,
    backCamera: getElement("#camerasau").value,
    frontCamera: getElement("#cameratruoc").value,
    img: getElement("#HinhSP").value,
    desc: getElement("#MotaSP").value,
    type: getElement("#loaiSP").value,
  };

  // Gọi API thêm sản phẩm
  apiCreateProduct(product)
    .then((response) => {
      // Sau khi thêm thành công, dữ liệu chỉ mới được cập nhật ở phía server. Ta cần gọi lại hàm apiGetProducts để lấy được danh sách những sản phẩm mới nhất (bao gồm sản phẩm mình mới thêm)
      return apiGetProducts();
    })
    .then((response) => {
      // response là kết quả promise của hàm apiGetProducts
      display(response.data);
      // Ẩn modal
      $("#myModal").modal("hide");
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteProduct(productId) {
  apiDeleteProduct(productId)
    .then(() => {
      // Xoá thành công
      return apiGetProducts();
    })
    .then((response) => {
      display(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function selectProduct(productId) {
  // Hiển thị modal
  $("#myModal").modal("show");
  // Hiển thị title và footer của modal
  getElement(".modal-title").innerHTML = "Cập nhật sản phẩm";
  getElement(".modal-footer").innerHTML = `
    <button class="btn btn-secondary" data-dismiss="modal">Huỷ</button>
    <button class="btn btn-success" onclick="updateProduct('${productId}')">Cập nhật</button>
  `;

  apiGetProductById(productId)
    .then((response) => {
      // Lấy thông tin sản phẩm thành công => hiển thị dữ liệu lên form
      let product = response.data;
      getElement("#TenSP").value = product.name;
      getElement("#GiaSP").value = product.price;
      getElement("#ScreenSP").value = product.screen;
      getElement("#camerasau").value = product.backCamera;
      getElement("#cameratruoc").value = product.frontCamera;

      getElement("#HinhSP").value = product.img;
      getElement("#MotaSP").value = product.desc;

      getElement("#loaiSP").value = product.type;
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateProduct(productId) {
  // DOM và khởi tạo object product
  let newProduct = {
    name: getElement("#TenSP").value,
    price: +getElement("#GiaSP").value,
    screen: getElement("#ScreenSP").value,
    backCamera: getElement("#camerasau").value,
    frontCamera: getElement("#cameratruoc").value,
    img: getElement("#HinhSP").value,
    desc: getElement("#MotaSP").value,
    type: getElement("#loaiSP").value,
  };

  apiUpdateProduct(productId, newProduct)
    .then(() => {
      // Cập nhật thành công
      return apiGetProducts();
    })
    .then((response) => {
      display(response.data);
      $("#myModal").modal("hide");
    })
    .catch((error) => {
      console.log(error);
    });
}

function display(products) {
  let html = products.reduce((result, value, index) => {
    let product = new Product(
      value.id,
      value.name,
      value.price,
      value.screen,
      value.backCamera,
      value.frontCamera,
      value.img,
      value.desc,
      value.type
    );

    return (
      result +
      `
        <tr>
          <td>${index + 1}</td>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.screen}</td>
          <td>${product.backCamera}</td>
          <td>${product.frontCamera}</td>
          <td>
            <img src="${product.img}" width="100px" height="100px" />
          </td>
          <td>${product.desc}</td>

          <td>${product.type}</td>
          <td class="d-flex flex-start">
            <button
              class="btn btn-primary"
              onclick="selectProduct('${product.id}')"
            >
              Xem
            </button>
            <button
              class="btn btn-danger"
              onclick="deleteProduct('${product.id}')"
            >
              Xoá
            </button>
          </td>
        </tr>
      `
    );
  }, "");

  document.getElementById("tblDanhSachSP").innerHTML = html;
}
//TÌm kiếm

function searchProducts() {
  // Get the search keyword entered by the user
  let keyword = getElement("#searchInput").value.trim().toLowerCase();

  // Call the API to get all products
  apiGetProducts()
    .then((response) => {
      // Filter the products based on the search keyword
      let filteredProducts = response.data.filter((product) => {
        // Convert both the product name and search keyword to lowercase for a case-insensitive search
        return product.name.toLowerCase().includes(keyword);
      });

      // Display the filtered products
      display(filteredProducts);
    })
    .catch((error) => {
      console.log(error);
    });
}

// ======= DOM =======
getElement("#btnThemSP").onclick = () => {
  getElement(".modal-title").innerHTML = "Thêm sản phẩm";
  getElement(".modal-footer").innerHTML = `
    <button class="btn btn-secondary" data-dismiss="modal">Huỷ</button>
    <button class="btn btn-success" onclick="createProduct(), validateAndSubmit()">Thêm</button>
  `;
};

// ======= Utils =======
function getElement(selector) {
  return document.querySelector(selector);
}

// Validate

function validateAndSubmit() {
  // Define the validation constraints for the form fields
  const constraints = {
    TenSP: {
      presence: {
        allowEmpty: false,
        message: "^Tên Sản Phẩm không được bỏ trống",
      },
    },
    GiaSP: {
      presence: { allowEmpty: false, message: "^Giá không được bỏ trống" },
      numericality: {
        greaterThan: 0,
        message: "^Giá phải là một số lớn hơn 0",
      },
    },
    // Add more constraints for other fields if needed
  };

  // Get the form data
  const formData = {
    TenSP: document.getElementById("TenSP").value,
    GiaSP: document.getElementById("GiaSP").value,
  };

  // Perform the validation
  const validationErrors = validate(formData, constraints);

  // Check if there are any validation errors
  if (validationErrors) {
    // If there are errors, display them to the user
    for (const field in validationErrors) {
      const errorMessages = validationErrors[field];
      const errorMessage = errorMessages.join(", ");
      alert(errorMessage);
    }
  }
}

// pagination
const productsPerPage = 10; // Number of products to display per page

function display(products, currentPage = 1) {
  // Calculate start and end indices of products to display on the current page
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = Math.min(startIndex + productsPerPage, products.length);

  // Generate the HTML for the products on the current page
  let html = "";
  for (let i = startIndex; i < endIndex; i++) {
    const product = products[i];
    // Generate HTML for each product row
    const productRowHTML = `
      <tr>
        <td>${i + 1}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.screen}</td>
          <td>${product.backCamera}</td>
          <td>${product.frontCamera}</td>
          <td>
            <img src="${product.img}" width="100px" height="100px" />
          </td>
          <td>${product.desc}</td>

          <td>${product.type}</td>
          <td class="d-flex flex-start">
            <button
              class="btn btn-primary"
              onclick="selectProduct('${product.id}')"
            >
              Xem
            </button>
            <button
              class="btn btn-danger"
              onclick="deleteProduct('${product.id}')"
            >
              Xoá
            </button>
          </td>
      </tr>
    `;

    // Append the row HTML to the overall HTML
    html += productRowHTML;
  }

  // Update the table body with the generated HTML
  document.getElementById("tblDanhSachSP").innerHTML = html;

  // Update pagination
  updatePagination(products, currentPage);
}

function updatePagination(products, currentPage) {
  const totalPages = Math.ceil(products.length / productsPerPage);
  let paginationHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <li class="page-item${i === currentPage ? " active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
      </li>
    `;
  }

  document.getElementById("pagination").innerHTML = paginationHTML;
}

function changePage(pageNumber) {
  apiGetProducts()
    .then((response) => {
      // Get all products from the API
      const products = response.data;

      // Display the specified page
      display(products, pageNumber);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Call this function on page load to display the first page of products
changePage(1);

// Sort
let currentSortOrder = "asc"; // Default sorting order is ascending

function sortProductsByName() {
  apiGetProducts()
    .then((response) => {
      // Get all products from the API
      const products = response.data;

      // Sort products by name in ascending order
      products.sort((a, b) =>
        a.name.localeCompare(b.name, "en", { sensitivity: "base" })
      );

      // Display the sorted products
      display(products);
    })
    .catch((error) => {
      console.log(error);
    });
}

function toggleSortProductsByPrice() {
  apiGetProducts()
    .then((response) => {
      // Get all products from the API
      const products = response.data;
      // Sort products by price based on the current sorting order
      if (currentSortOrder === "asc") {
        // Sort in ascending order
        products.sort((a, b) => a.price - b.price);
        currentSortOrder = "desc"; // Update current sorting order
      } else {
        // Sort in descending order
        products.sort((a, b) => b.price - a.price);
        currentSortOrder = "asc"; // Update current sorting order
      }
      // Display the sorted products
      display(products);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Rest of the code remains the same...
