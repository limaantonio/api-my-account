import UserRepository from '../respositories/UserRepository';
import { getCustomRepository } from 'typeorm';

export default class UserController {
  async create(request: Request, response: Response): Promise {
    const userRepository = getCustomRepository(UserRepository);
    const { name, email, password } = request.body;
    let user;

    try {
      user = await userRepository.save({
        name,
        email,
        password,
        created_at: new Date(),
        updated_at: new Date(),
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(user);
  }

  async login(request: Request, response: Response): Promise {
    const userRepository = getCustomRepository(UserRepository);
    const { name, password } = request.body;
    let user;

    try {
      user = await userRepository.findOne({
        where: { name, password },
      });
      console.log(user);
      if (user === undefined) {
        return response.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(user);
  }
}
