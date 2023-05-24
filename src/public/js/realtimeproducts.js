const socket = io();
const tableBody = document.getElementById('result-rows');

const sendData = async (productTitle, description, code, price, stock, category, thumbnail) => {
    const dataToEmit = {
        status: 'error',
        productId: 0,
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = {
        "title": productTitle,
        "description": description,
        "code": code,
        "price": price,
        "stock": stock,
        "category": category,
        "thumbnail": thumbnail,
    };

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow',
    };

    fetch("http://localhost:8080/api/products", requestOptions)
        .then(response => response.json())
        .then(result => {
            const data = {
                status: result.status,
                productId: result.productId,
                data: raw,
            }
            if(data.status === 'done'){
                socket.emit('data_list_update', data);
            }
        })
        .catch(error => console.log('error', error));
};

const deleteProduct = async (productId) => {
    const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    fetch(`http://localhost:8080/api/products/${productId}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            const data = {
                status: result.status,
                productId,
            }
            if(data.status === 'done'){
                socket.emit('data_list_delete', data);
            }
        })
        .catch(error => console.log('error', error));
};

const addProductButton = document.getElementById("new-product");
addProductButton.addEventListener("click", event => {
    const productTitle = document.getElementById("product-title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;
    const thumbnail = document.getElementById("thumbnail").value;
    sendData(productTitle, description, code, price, stock, category, thumbnail)
});

socket.on('updateProducts', (message) => {
    console.log('Agregando', message.data);
    const htmlToAdd = `<tr id="product-${message.productId}">
        <th scope="row">${message.productId}</th>
        <td>${message.data.title}</td>
        <td>${message.data.description}</td>
        <td>${message.data.code}</td>
        <td>${message.data.price}</td>
        <td>true</td>
        <td>${message.data.stock}</td>
        <td>${message.data.category}</td>
        <td><button type="button" class="btn btn-danger" id=${message.productId} onClick="deleteProduct(this.id)">Eliminar</button></td>
    </tr>`;
    tableBody.innerHTML += htmlToAdd;
});

socket.on('deleteProduct', (message) => {
    console.log('Eliminando', message.status);
    const element = document.getElementById(`product-${message.productId}`);
    element.remove();
});

socket.on('addProductPost', (message) => {
    console.log('addProductPost', message);
});