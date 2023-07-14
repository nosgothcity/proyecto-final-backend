import ChatModel from '../schemas/chats.schemas.js';
import MongooseSingleton from '../dbConnect.js';

class chatsDao {
    constructor() {
        const db = MongooseSingleton.getInstance();
    }

    modelSaveMessage = async message => {
        const result = await ChatModel.create(message)
        .then(response => {
            console.log('Nuevo mensaje creado');
            return true;
        })
        .catch(err => {
            console.log('Mensaje no creado');
            return false;
        });
        return result;
    };
}

export default chatsDao;