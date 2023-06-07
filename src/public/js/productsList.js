const addProductToCart = async (productId) => {
    console.log('productId', productId)
    const cart = '647fc1372b14059beb5aacf5';
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      "count": 1
    });
    
    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch(`http://localhost:8080/api/carts/${cart}/product/${productId}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        alert('Articulo agregado a carrito');
    })
      .catch(error => console.log('error', error));
};
