
import mongoose from 'mongoose';

const chatsSchema = mongoose.Schema({
    user:  {
        type: String,
        required: true,
    },
    message:  {
        type: String,
        required: true,
    },
});

const ChatModel = mongoose.model("Chats", chatsSchema);
export default ChatModel;