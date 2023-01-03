import { Budget } from '../entities/Budget';
import BudgetRepository from '../respositories/BudgetRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

export default class BudgetController {
  async listAll(
    request: Request,
    response: Response,
  ): Promise<Response<Budget>> {
    const budgetRepository = getCustomRepository(BudgetRepository);
    let budgets = [];
    try {
      budgets = await budgetRepository.find();
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(budgets);
  }

  async listById(
    request: Request,
    response: Response,
  ): Promise<Response<Budget>> {
    const budgetRepository = getCustomRepository(BudgetRepository);
    const { id } = request.params;
    let budgets;

    try {
      budgets = await budgetRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(budgets);
  }

  async deletById(
    request: Request,
    response: Response,
  ): Promise<Response<Budget>> {
    const budgetRepository = getCustomRepository(BudgetRepository);
    const { id } = request.params;

    try {
      await budgetRepository.delete(id);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.status(204);
  }

  async create(
    request: Request,
    response: Response,
  ): Promise<Response<Budget>> {
    const budgetRepository = getCustomRepository(BudgetRepository);
    const data = request.body;
    let budget;

    try {
      budget = await budgetRepository.create(data);
      await budgetRepository.save(budget);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(budget);
  }

  async update(
    request: Request,
    response: Response,
  ): Promise<Response<Budget>> {
    const budgetRepository = getCustomRepository(BudgetRepository);
    const { id } = request.params;
    const data = request.body;

    let budget;

    try {
      budget = await budgetRepository.update(id, {
        year: data.year,
        updated_at: new Date(),
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.status(204).json(budget);
  }
}
