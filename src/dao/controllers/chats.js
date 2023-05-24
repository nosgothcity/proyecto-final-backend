const chatsModel = require('../models/chats');

class ChatsManagerMongo {
    constructor() {}

    async newMessage(message) {
        const result = await chatsModel.create(message)
        .then(response => {
            console.log('Nuevo mensaje creado');
            return true;
        })
        .catch(err => {
            console.log('Mensaje no creado');
            return false;
        });
        return result;
    }
}

module.exports = ChatsManagerMongo;
