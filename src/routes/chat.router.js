const express = require('express');
const router = express.Router();
const ChatsManager = require('../dao/controllers/chats');
const chatsManager = new ChatsManager();

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
    const newMessage = chatsManager.newMessage(messageData);
    if(newMessage){
        return res.status(200).send({status: 'done', message: 'Message created'});
    } else {
        return res.status(400).send({status: 'error', message: 'Message can\'t be created'});
    }
});

module.exports = router;