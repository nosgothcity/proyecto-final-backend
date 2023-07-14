import ChatDaoMongo from '../models/DAO/chat.dao.js';

const chatDb = new ChatDaoMongo();

const renderChat = (req, res)=>{
    res.render('chat');
};

const saveMessages = async (req, res) => {
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
    const newMessage = await chatDb.modelSaveMessage(messageData);
    if(newMessage){
        return res.status(200).send({status: 'done', message: 'Message created'});
    } else {
        return res.status(400).send({status: 'error', message: 'Message can\'t be created'});
    }
};

export {
    renderChat,
    saveMessages,
};