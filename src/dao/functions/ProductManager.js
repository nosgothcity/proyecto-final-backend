const fs = require('fs');

class ProductManager {
    constructor() {
        this.path = './src/data/products-list.txt';
    }
  
    async getProducts() {
        const products = [];
        products.push(... await this.readProductsFile());
        return products;
    }

    async getProductById(id) {
        const products = [];
        products.push(... await this.readProductsFile());
        const productFound = products.find(product => product.id === parseInt(id, 10));

        if(!productFound){
            return {
                status: 'error',
                message: 'ProductId not found',
            };
        }

        return productFound;
    }

    async addProduct(newProduct) {
        const products = [];
        const title = newProduct?.title??'';
        const description = newProduct?.description??'';
        const code = newProduct?.code??'';
        const price = newProduct?.price??0;
        const stock = newProduct?.stock??0;
        const category = newProduct?.category??'';
        let id = 1;

        if(title.length === 0 || description.length === 0 || code.length === 0 || price === 0 || stock === 0 || category.length === 0){
            return {
                status: 'error',
                message: 'Incomplete values',
            };
        }

        products.push(... await this.readProductsFile());

        if(products.length > 0){
            console.log(`Verificando si el nuevo producto de code ${code} ya existe en el listado....`);
            id = products.length + 1
            const found = products.some(product => product.code === code);
            if(found){
                return {
                    status: 'error',
                    message: 'Product already exists',
                };
            }
        }
    
        products.push({
            id,
            title       : newProduct.title,
            description : newProduct.description,
            code        : newProduct.code,
            price       : newProduct.price,
            status      : true,
            stock       : newProduct.stock,
            category    : newProduct.category,
            thumbnail   : newProduct.thumbnail??'',
        });

        const response = await fs.promises.writeFile(this.path, JSON.stringify(products, "\n"))
            .then(() => {
                return {
                    status: 'done',
                    message: 'Product added',
                    id_product: id,
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

    async updateProduct(id, productToUpdate) {
        const products = [];
        const productIsEmpty = Object.entries(productToUpdate).length;
        const idToSearch = parseInt(id, 10);

        if(!id || idToSearch <= 0 || productIsEmpty === 0){
            console.log(`Se debe entregar un id para realizar la actualizacion o el object del producto para modificar es inválido`);
            return {
                status: 'error',
                message: 'Incomplete values',
            }
        }

        products.push(... await this.readProductsFile());
        const productFound = products.find(product => product.id === idToSearch);
        if(!productFound){
            console.log(`No existen productos para actualizar con el id ${id}`);
            return {
                status: 'done',
                message: 'Product not found',
            }
        }else{
            let status = null;
            if(productToUpdate.status){
                const checkStatus = typeof productToUpdate.status??'invalid';
                if(checkStatus === 'boolean'){
                    status = productToUpdate.status;
                }
            }

            productFound.title = productToUpdate.title??productFound.title;
            productFound.description = productToUpdate.description??productFound.description;
            productFound.code = productToUpdate.code??productFound.code;
            productFound.price = productToUpdate.price??productFound.price;
            productFound.status = status??productFound.status;
            productFound.thumbnail = productToUpdate.thumbnail??productFound.thumbnail;
            productFound.category = productToUpdate.category??productFound.category;
            productFound.stock = productToUpdate.stock??productFound.stock;

            const response = await fs.promises.writeFile(this.path, JSON.stringify(products, "\n"))
                .then(() => {
                    return {
                        status: 'done',
                        message: 'Product updated',
                    }
                })
                .catch((error) => {
                    console.error('Error al generar archivo', error);
                    return {
                        status: 'error',
                        message: 'Error when trying to update product',
                    }
                });

            return response;
        }
    }

    async deleteProduct(id){
        const products = [];
        const idToSearch = parseInt(id, 10);

        if(!id || idToSearch <= 0){
            console.log(`Se debe entregar un id valido para eliminar un producto`);
            return {
                status: 'error',
                message: 'Incomplete/Invalid values',
            }
        }

        products.push(... await this.readProductsFile());
        const productFound = products.some(product => product.id === idToSearch);
        if(!productFound){
            console.log(`No existen productos para eliminar con el id ${idToSearch}`);
            return {
                status: 'done',
                message: 'Product not found',
            }
        }else{
            const newProductList = products.filter(product => product.id !== idToSearch);
            const response = await fs.promises.writeFile(this.path, JSON.stringify(newProductList, "\n"))
                .then(() => {
                    return {
                        status: 'done',
                        message: 'Product deleted',
                    }
                })
                .catch((error) => {
                    console.error('Error al generar archivo', error);
                    return {
                        status: 'error',
                        message: 'Error when trying to delete a product',
                    }
                });
            return response;
        }
    }

    async readProductsFile(){
        return await fs.promises.readFile(this.path, 'utf-8')
            .then(result => JSON.parse(result))
            .catch(error => []);
    }

}

module.exports = ProductManager;
