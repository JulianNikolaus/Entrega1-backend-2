import UserRepository from './UserRepository.js';
import UserDTO from '../dto/user.dto.js';
import userModel from '../dao/models/user.model.js';


export const userRepository = new UserRepository(userModel);