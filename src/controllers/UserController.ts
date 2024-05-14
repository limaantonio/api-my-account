import UserRepository from '../respositories/UserRepository';
import { getCustomRepository } from 'typeorm';

export default class UserController {
  async listById(request: Request, response: Response): Promise {
    const userRepository = getCustomRepository(UserRepository);
    let user;

    try {
      user = await userRepository.findOne(request.params.id);
      return response.json(user);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}
