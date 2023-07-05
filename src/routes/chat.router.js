import { Router } from 'express';
import ChatModel from '../models/chats.model.js';

const router = Router();

const createMessage = async message => {
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

router.get('/',(req,res)=>{
    res.render('chat');
});

router.post('/', async (req, res) => {
    const messageData = [];
    const user = req.body?.user??'';
    const message = req.body?.message??'';

    if(user.length === 0 || message.length === 0){
        return res.status(400).send({ error: "Incomplete values" });
    }

    messageData.push({
        user,
        message,
    });
    const newMessage = await createMessage(messageData);
    if(newMessage){
        return res.status(200).send({status: 'done', message: 'Message created'});
    } else {
        return res.status(400).send({status: 'error', message: 'Message can\'t be created'});
    }
});

export default router;
