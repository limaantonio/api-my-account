import { Balance } from '../entities/Balance';
import BalanceRepository from '../respositories/BalanceRepository';
import BudgetRepository from '../respositories/BudgetRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { getAmount, getBalance, getResult } from '../services/BalanceService';

interface IBalance {
  incomes: number;
  expense: number;
  result: number;
  balance: Balance;
}

export default class BalanceController {
  async listAll(
    request: Request,
    response: Response,
  ): Promise<Response<Balance>> {
    const balanceRepository = getCustomRepository(BalanceRepository);
    let balances = [];
    try {
      balances = await balanceRepository.find();
      var totalBalance = [] as IBalance[];

      balances.forEach(balance => {
        totalBalance.push(getBalance(balance as Balance));
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(totalBalance);
  }

  async listById(
    request: Request,
    response: Response,
  ): Promise<Response<Balance>> {
    const balanceRepository = getCustomRepository(BalanceRepository);
    const { id } = request.params;
    let balance;

    try {
      balance = await balanceRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(getBalance(balance as Balance));
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
    let err;

    try {
      if (!data.budget_id) {
        err = 'Budget is required';
        throw new Error(err as any);
      } else {
        budget = await budgetRepository.findOne({
          where: { id: data.budget_id },
        });
      }

      if (!data.month) {
        err = 'Month is required';
        throw new Error('Month is required' as any);
      }

      const monthBalance = await balanceRepository.findOne({
        where: { month: data.month },
      });

      if (monthBalance) {
        err = 'Month already exists';
        throw Error('Month already exists' as any);
      }

      balance = await balanceRepository.create({
        ...data,
        budget,
      });
      await balanceRepository.save(balance);
    } catch (error) {
      return response.status(400).json({ Error: err });
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

    return response.status(204).json();
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
      await balanceRepository.update(id, {
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
