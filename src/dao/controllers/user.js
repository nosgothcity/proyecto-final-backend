const userModel = require('../models/user');

class UserManager {
    constructor() {}

    async getUserLogin(userData) {
        const user = await userModel.findOne(userData).lean()
            .then(response => {
                console.log('User encontrado');
                return true;
            })
            .catch(err => {
                console.log('User NO encontrado');
                return false;
            });
        return user;
    }
}

module.exports = UserManager;
