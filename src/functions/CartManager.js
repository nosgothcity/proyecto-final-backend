const fs = require('fs');

class CartManager {
    constructor() {
        this.cartsPath = './src/data/cart-list.txt';
        this.productsPath = './src/data/products-list.txt';
    }
  
    async getCartById(id) {
        const carts = [];
        carts.push(... await this.readCartFile());
        const cartFound = carts.find(cart => cart.id === parseInt(id, 10));
        return cartFound;
    }

    async newCart() {
        const carts = [];
        let id = 1;

        carts.push(... await this.readCartFile());

        if(carts.length > 0){
            id = carts.length + 1;
        }

        carts.push({
            id,
            products: [],
        });

        const response = await fs.promises.writeFile(this.cartsPath, JSON.stringify(carts, "\n"))
        .then(() => {
            return {
                status: 'done',
                message: `Cart created with the id: ${id}`,
            }
        })
        .catch((error) => {
            console.error('Error al generar archivo',error);
            return {
                status: 'error',
                message: 'Error when trying to create cart',
            }
        });

        return response;

    }

    async addProductToCart(cartId, productId) {
        const products = [];
        const carts = [];

        products.push(... await this.readProductsFile());
        carts.push(... await this.readCartFile());

        if(products.length === 0 || carts.length === 0){
            return {
                status: 'error',
                message: 'There are no carts or products to add...',
            };
        }

        const item = products.find(product => product.id === parseInt(productId, 10));
        const cartToAdd = carts.find(cart => cart.id === parseInt(cartId, 10));

        /**
         * Verifica si existe el carro y el producto que se quierer agregar a este carro.
         */
        if(!cartToAdd || !item){
            return {
                status: 'error',
                message: 'Cart or product doesn\'t exist...',
            };
        }

        const availableStock = parseInt(item.stock, 10);
        const checkProductInCart = cartToAdd.products.find(item => item.product === parseInt(productId, 10));

        if(checkProductInCart){
            if(availableStock > checkProductInCart.quantity){
                checkProductInCart.quantity = checkProductInCart.quantity + 1;
            } else {
                return {
                    status: 'error',
                    message: 'product has no more stock available',
                };
            }
        } else {
            cartToAdd.products.push({
                product: parseInt(productId, 10),
                quantity: 1,
            });
        }

        const response = await fs.promises.writeFile(this.cartsPath, JSON.stringify(carts, "\n"))
            .then(() => {
                return {
                    status: 'done',
                    message: 'Cart updated',
                }
            })
            .catch((error) => {
                console.error('Error al generar archivo',error);
                return {
                    status: 'error',
                    message: 'Error when trying to add product',
                }
            });

        return response;

    }

    async readCartFile(){
        return await fs.promises.readFile(this.cartsPath, 'utf-8')
            .then(result => JSON.parse(result))
            .catch(error => []);
    }

    async readProductsFile(){
        return await fs.promises.readFile(this.productsPath, 'utf-8')
            .then(result => JSON.parse(result))
            .catch(error => []);
    }

}

module.exports = CartManager;
