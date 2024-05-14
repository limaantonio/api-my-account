import { Request, Response } from 'express';
import UserRepository from '../respositories/UserRepository';
import { getCustomRepository } from 'typeorm';

interface IResquestUser {
  name: string;
  email: string;
  password: string;
}

export default class UserController {
  async listById(
    request: Request,
    response: Response,
  ): Promise<Response<IResquestUser>> {
    const userRepository = getCustomRepository(UserRepository);
    const { id } = request.params;
    let _budgetMonth;

    try {
      _budgetMonth = await userRepository.findOne(id);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(_budgetMonth);
  }
}
