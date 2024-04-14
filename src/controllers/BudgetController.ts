import { Budget } from '../entities/Budget';
import BudgetRepository from '../respositories/BudgetRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { getBudget } from '../services/BudgetService';

export default class BudgetController {
  async listAll(
    request: Request,
    response: Response,
  ): Promise<Response<Budget>> {
    const budgetRepository = getCustomRepository(BudgetRepository);

    let budgets = [];
    let totalBudgets = [];

    try {
      budgets = await budgetRepository.find();
      totalBudgets = budgets.map(budget => getBudget(budget));
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(totalBudgets);
  }

  async listById(
    request: Request,
    response: Response,
  ): Promise<Response<Budget>> {
    const budgetRepository = getCustomRepository(BudgetRepository);
    const { id } = request.params;
    let budget;
    let _budget;

    try {
      budget = await budgetRepository.findOne({
        where: { id },
      });
      _budget = getBudget(budget as Budget);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(_budget);
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

    return response.status(204).send();
  }

  async create(
    request: Request,
    response: Response,
  ): Promise<Response<Budget>> {
    const budgetRepository = getCustomRepository(BudgetRepository);
    const data = request.body;
    let budget;
    let err;

    try {
      if (!data.year) {
        err = 'Year is required';
        throw new Error('Year is required' as any);
      } else {
        budget = await budgetRepository.findOne({
          where: { year: data.year },
        });
        if (budget) {
          err = 'Year already exists';
          throw new Error('Year already exists' as any);
        }
      }

      budget = await budgetRepository.create(data);
      await budgetRepository.save(budget);
    } catch (error) {
      return response.status(400).json({ Error: err });
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
