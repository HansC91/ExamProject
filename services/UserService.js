class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
    }

    async create(username, firstname, lastname, email, encryptedPassword, salt) {
        return this.User.create(
            {
                username: username,
                firstname: firstname,
                lastname: lastname,
                email: email,
                salt: salt,
                encryptedPassword: encryptedPassword,
                RoleId: 2
            });
    }

    async getAll() {
        return this.User.findAll({
            where: { }
        })
    }

    async getAllEmail(email) {
        return this.User.findAll({
            where: {email: email}
        })
    }

    async getOneByName(username) {        
        return await this.User.findOne({
            where: {username: username},
        });
    }

    async getOneById(id) {
        return await this.User.findOne({
            where: {id: id}
        })
    }

    async deleteUser(id) {
        return this.User.destroy({
            where: {id: id}
        })
    }
}
module.exports = UserService;