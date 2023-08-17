function apiGetProducts() {
    return axios({
      url: "https://64ae4a6cc85640541d4cbf95.mockapi.io/Products",
      method: "GET",
    });
  }
  
  function apiGetProductById(productId) {
    return axios({
      url: `https://64ae4a6cc85640541d4cbf95.mockapi.io/Products/${productId}`,
      method: "GET",
    });
  }
  // product = {name: "...", price: 1000, image: "...", type: "..."}
  function apiCreateProduct(product) {
    return axios({
      url: "https://64ae4a6cc85640541d4cbf95.mockapi.io/Products",
      method: "POST",
      data: product,
    });
  }
  
  function apiUpdateProduct(productId, newProduct) {
    return axios({
      url: `https://64ae4a6cc85640541d4cbf95.mockapi.io/Products/${productId}`,
      method: "PUT",
      data: newProduct,
    });
  }
  
  function apiDeleteProduct(productId) {
    return axios({
      url: `https://64ae4a6cc85640541d4cbf95.mockapi.io/Products/${productId}`,
      method: "DELETE",
    });
  }
  