import UserDTO from '../dto/user.dto.js';

export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getUserById(id) {
        return await this.dao.findById(id);
    }

    async getUserByEmail(email) {
        return await this.dao.findOne({ email });
    }

    async createUser(userData) {
        return await this.dao.create(userData);
    }

    
    getCurrentUser(user) {
        return new UserDTO(user); 
    }
}