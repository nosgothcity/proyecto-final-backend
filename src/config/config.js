import dotenv from 'dotenv';

dotenv.config();

export default {
    port        : process.env.PORT,
    mongoUrl    : process.env.MONGO_URL,
    mongoDb     : process.env.MONGO_DB,
    adminName   : process.env.ADMIN_NAME,
    adminPass   : process.env.ADMIN_PASSWORD,
    passport    : {
        clientID    : process.env.PP_CLIENT_ID,
        clientSecret: process.env.PP_CLIENT_SECRET,
        callbackURL : process.env.PP_CALLBACK_URL,
    }
};