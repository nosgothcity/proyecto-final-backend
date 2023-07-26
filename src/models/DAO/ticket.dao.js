import TicketModel from '../schemas/ticket.schemas.js';
import MongooseSingleton from '../dbConnect.js';

class ticketDao {
    constructor() {
        const db = MongooseSingleton.getInstance();
    }

    modelCreateTicket = async (data) => {
        const result = await TicketModel.create(data)
        .then(response => {
            console.log('Ticket creado');
            return true;
        })
        .catch(err => {
            console.log('Ticket no creado');
            return false;
        });
        return result;
    };

};

export default ticketDao;