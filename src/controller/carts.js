import { v4 as uuidv4 } from 'uuid';
import CartsDaoMongo from '../models/DAO/carts.dao.js';
import ProductDaoMongo from '../models/DAO/products.dao.js';
import TicketDaoMongo from '../models/DAO/ticket.dao.js';

const cartsDb = new CartsDaoMongo();
const productsDb = new ProductDaoMongo();
const ticketDb = new TicketDaoMongo();

const getCartById = async (req, res) => {
    const cartId = req.params.pid;
    if(!cartId){
        return res.status(400).send({status: 'error', message: 'CartId not valid'});
    }

    const cartData = await cartsDb.modelGetCartById(cartId);
    if(cartData){
        return res.send(cartData);
    } else {
        return res.status(400).send({status: 'error', message: 'CartId not found'});
    }
};

const createCart = async (req, res) => {
    const product = req.body.product;
    const count = req.body.count;

    const date = new Date().toISOString().split('T')[0];
    const products = [];
    const addProduct = {
        date,
    };

    if(product && count && product !== ''){
        products.push({
            product,
            count,
        });
        addProduct.products = products;
    }

    const response = await cartsDb.modelCreateCart(addProduct);

    if(response){
        return res.status(200).send({status: 'done', message: 'Cart created'});
    } else {
        return res.status(400).send({status: 'error', message: 'Cart can\'t be created'});
    }
};

const addProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const count = req.body?.count??0;

    const products = [];
    const date = new Date().toISOString().split('T')[0];
    const addProduct = {
        date,
    };

    const cartData = await cartsDb.modelGetCartById(cartId);
    const productData = await productsDb.modelGetProductsByParameter({_id: `${productId}`});

    if(!cartData || !productData){
        return res.status(400).send({status: 'error', message: 'CartId/ProductId not found'});
    }

    if(count === 0){
        return res.status(400).send({status: 'error', message: 'Count must be more than 0'});
    }

    if(cartData.products.length > 0){
        for (const product of cartData.products) {
            products.push({
                product: product.product._id.toString(),
                count: product.count,
            });
        }
    }

    if(products.length > 0){
        const checkProduct = products.findIndex(element => element.product === productId);
        if(checkProduct >= 0){
            products[checkProduct].count += count;
        } else {
            products.push({
                product: productId,
                count,
            });
        }
    } else {
        products.push({
            product: productId,
            count,
        });
    }

    addProduct.products = products;
    const response = await cartsDb.modelUpdateProductToCart(cartId, addProduct);

    if(response){
        return res.status(200).send({status: 'done', message: 'Cart updated'});
    } else {
        return res.status(400).send({status: 'error', message: 'service not available'});
    }
};

const deleteProductFromCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const products = [];
    const date = new Date().toISOString().split('T')[0];
    const addProduct = {
        date,
    };

    const cartData = await cartsDb.modelGetCartById(cartId);
    const productData = await productsDb.modelGetProductsByParameter({_id: `${productId}`});

    if(!cartData || !productData){
        return res.status(400).send({status: 'error', message: 'CartId/ProductId not found'});
    }

    const productIndex = cartData.products.findIndex(product => product.product._id.toString() === productId);

    if (productIndex === -1) {
        return res.status(400).send({status: 'error', message: 'ProductId not found in Cart'});
    }

    cartData.products.splice(productIndex, 1);
    if(cartData.products.length > 0){
        for (const product of cartData.products) {
            products.push({
                product: product.product._id.toString(),
                count: product.count,
            });
        }
    }

    addProduct.products = products;
    const response = await cartsDb.modelUpdateProductToCart(cartId, addProduct);

    if(response){
        return res.status(200).send({status: 'done', message: 'Cart updated'});
    } else {
        return res.status(400).send({status: 'error', message: 'service not available'});
    }
};

const deleteCart = async (req, res) => {
    const cartId = req.params.cid;

    const products = [];
    const date = new Date().toISOString().split('T')[0];
    const addProduct = {
        date,
    };

    const cartData = await cartsDb.modelGetCartById(cartId);

    if(!cartData){
        return res.status(400).send({status: 'error', message: 'CartId not found'});
    }

    addProduct.products = products;
    const response = await cartsDb.modelUpdateProductToCart(cartId, addProduct);

    if(response){
        return res.status(200).send({status: 'done', message: 'Removed all products from cart'});
    } else {
        return res.status(400).send({status: 'error', message: 'service not available'});
    }
};

const purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    const cartData = await cartsDb.modelGetCartById(cartId);
    const productInCart = [];
    const productToBuy = [];
    const productsWithoutStock = [];

    if(!cartData){
        return res.status(400).send({status: 'error', message: 'CartId not found'});
    }

    productInCart.push(... cartData.products);

    if(productInCart.length > 0){
        for (const datum of productInCart) {
            const productStock = datum.product.stock;
            const productCount = datum.count;

            if(productStock && productStock > 0 && productStock >= productCount){
                const newStock = productStock - productCount;
                await productsDb.modelUpdateProduct(datum.product._id.toString(), {stock: newStock});
                productToBuy.push(datum);
            } else {
                productsWithoutStock.push({
                    product: datum.product._id.toString(),
                    count: datum.count,
                });
            }
        }
    } else {
        return res.status(400).send({status: 'error', message: 'cart without products'});
    }

    if(productToBuy.length > 0){
        let total = 0;
        for (const datum of productToBuy) {
            const price = datum.product.price;
            const count = datum.count;
            const productPriceTotal = price*count;
            total += productPriceTotal;
        }
        const uId = uuidv4();
        const newTicket = [{
            code: uId,
            purchase_datetime: new Date().toISOString().replace('T', ' ').split('.')[0],
            amount: total,
            purchaser: 'test@gmail.com',
        }];
        const response = await ticketDb.modelCreateTicket(newTicket);
    }

    if(productsWithoutStock.length > 0){
        const addProduct = {
            products: productsWithoutStock,
            date: new Date().toISOString().split('T')[0],
        };
        const response = await cartsDb.modelUpdateProductToCart(cartId, addProduct);
    } else {
        const response = await cartsDb.modelDeleteCompleteCart(cartId);
    }

    return res.status(200).send({status: 'done', message: 'Ticket creado.'});
};

export {
    getCartById,
    createCart,
    addProductToCart,
    deleteProductFromCart,
    deleteCart,
    purchaseCart,
};