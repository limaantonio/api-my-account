import { BudgetMonth } from '../entities/BudgetMonth';
import BudgetMonthRepository from '../respositories/BudgetMonthRepository';
import BudgetRepository from '../respositories/BudgetRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { getBudget, verifyAmountBalance } from '../services/BudgetMonthService';
import {Entry} from '../entities/Entry'
import EntryRepository from '../respositories/EntryRepository'
import { Budget } from '../entities/Budget';

interface IResquestBudgetMonth {
  month: number;
  budget_id: string;
}

export default class BudgetMonthController {
  async create(
    request: Request,
    response: Response,
  ): Promise<Response<BudgetMonth>> {
    const budgetMonthRepository = getCustomRepository(BudgetMonthRepository);
    const budgetRepository = getCustomRepository(BudgetRepository);
    const { month, budget_id } = request.body as IResquestBudgetMonth;
    let _budgetMonth;
    let _budget;

    try {
      _budget = await budgetRepository.findOne({
        where: { id: budget_id },
      });

      _budgetMonth = await budgetMonthRepository.create({
        month,
        budget: _budget as Budget,
      });

      await budgetMonthRepository.save(_budgetMonth);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(_budgetMonth);
  }

  async listByBudget(
    request: Request,
    response: Response,
  ): Promise<Response<BudgetMonth[]>> {
    const budgetMonthRepository = getCustomRepository(BudgetMonthRepository);
    const { id } = request.params;
    let _budgetMonth;

    try {
      _budgetMonth = await budgetMonthRepository.find({
        where: { budget_id: id },
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(_budgetMonth);
  }

  async deletById(
    request: Request,
    response: Response,
  ): Promise<Response<Budget>> {
    const budgetMonthRepository = getCustomRepository(BudgetMonthRepository);
    const { id } = request.params;

    try {
      await budgetMonthRepository.delete(id);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.status(204).send();
  }

  async getBalance(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const budgetMonthRepository = getCustomRepository(BudgetMonthRepository);
    const entryRepository = getCustomRepository(EntryRepository);
    const { id } = request.params;
    let _budgetMonth;
    let _entries;

    try {
      _budgetMonth = await budgetMonthRepository.findOne({
        where: { id },
        relations: ['entries', 'entries.account'],
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    const balance = getBudget(_budgetMonth)

    return response.json(balance);
  }

}
