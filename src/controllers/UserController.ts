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
      _budgetMonth = await userRepository.findOne({
        where: { id },
        relations: ['budget'],
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(_budgetMonth);
  }

  async list(
    request: Request,
    response: Response,
  ): Promise<Response<IResquestUser>> {
    const userRepository = getCustomRepository(UserRepository);
    let _budgetMonth;

    try {
      _budgetMonth = await userRepository.find();
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(_budgetMonth);
  }
}
