const express = require('express');
const { engine } = require('express-handlebars');
const { Server } = require('socket.io');

const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const home = require('./routes/home.router.js');
const realTimeProducts = require('./routes/realTimeProducts.router.js');
const chat = require ('./routes/chat.router.js');

const app = express();
app.use(express.static(__dirname+'/public'))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/home', home);
app.use('/realtimeproducts', realTimeProducts);
app.use('/chat', chat);

app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

const server = app.listen(8080, () => console.log(`servidor escuchando en http://localhost:8080/`));
const io = new Server(server);
const messages = [];

io.on('connection', socket => {
    socket.on('data_list_update', (data) => {
        io.emit('updateProducts', data);
    });

    socket.on("data_list_delete", data => {
        io.emit('deleteProduct', data);
    });

    socket.on("add_product_post", data => {
        io.emit('addProductPost', data);
    });

    socket.on("message", data => {
        messages.push(data);
        io.emit('messageLogs', messages);
    });
});
