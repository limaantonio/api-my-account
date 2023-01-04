import { Balance } from '../entities/Balance';
import BalanceRepository from '../respositories/BalanceRepository';
import BudgetRepository from '../respositories/BudgetRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

export default class BalanceController {
  async listAll(
    request: Request,
    response: Response,
  ): Promise<Response<Balance>> {
    const balanceRepository = getCustomRepository(BalanceRepository);
    let balances = [];
    try {
      balances = await balanceRepository.find();
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(balances);
  }

  async listById(
    request: Request,
    response: Response,
  ): Promise<Response<Balance>> {
    const balanceRepository = getCustomRepository(BalanceRepository);
    const { id } = request.params;
    let balances;

    try {
      balances = await balanceRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(balances);
  }

  async create(
    request: Request,
    response: Response,
  ): Promise<Response<Balance>> {
    const budgetRepository = getCustomRepository(BudgetRepository);
    const balanceRepository = getCustomRepository(BalanceRepository);
    const data = request.body;

    let balance;
    let budget;

    try {
      budget = await budgetRepository.findOne({
        where: { id: data.budget_id },
      });

      balance = await balanceRepository.create({
        ...data,
        budget,
      });
      await balanceRepository.save(balance);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(balance);
  }

  async deletById(
    request: Request,
    response: Response,
  ): Promise<Response<Balance>> {
    const balanceRepository = getCustomRepository(BalanceRepository);
    const { id } = request.params;

    try {
      await balanceRepository.delete(id);
    } catch (error) {
      return response.json(error);
    }

    return response.status(204);
  }

  async update(
    request: Request,
    response: Response,
  ): Promise<Response<Balance>> {
    const balanceRepository = getCustomRepository(BalanceRepository);
    const { id } = request.params;
    const data = request.body;

    let balance = await balanceRepository.findOne(id);

    try {
      balance = await balanceRepository.update(id, {
        month: data.month ? data.month : balance?.month,
        budget: data.budget ? data.budget : balance?.budget,
        updated_at: new Date(),
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.status(204).json(balance);
  }
}
