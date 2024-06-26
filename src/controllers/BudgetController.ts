import { Budget } from '../entities/Budget';
import BudgetRepository from '../respositories/BudgetRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { getBudget } from '../services/BudgetService';
import UserRepository from '../respositories/UserRepository';

export default class BudgetController {
  async listAll(
    request: Request,
    response: Response,
  ): Promise<Response<Budget>> {
    const budgetRepository = getCustomRepository(BudgetRepository);

    let budgets = [];
    let totalBudgets = [];
    const { id } = request.params;

    try {
      budgets = await budgetRepository.find({
        where: { user: id },
        relations: ['budget_months', 'sub_accounts'],
      });
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
    const userRepository = getCustomRepository(UserRepository);
    const data = request.body;
    let budget;
    let err;

    try {
      const user = await userRepository.findOne({
        where: { id: data.user_id },
      });

      console.log(user);

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

      budget = await budgetRepository.create({
        year: data.year,
        user: user,
      });

      await budgetRepository.save(budget);
    } catch (error) {
      console.log(error);
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

  async setFlagIncomeRegister(
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

      _budget = await budgetRepository.update(id, {
        flag_income_registred: true,
        year: budget?.year,
        updated_at: new Date(),
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.status(204).json(budget);
  }
}
