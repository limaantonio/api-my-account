import { Account } from '../entities/Account';
import AccountRepository from '../respositories/AccountRepository';
import BudgetRepository from '../respositories/BudgetRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

export default class AccountController {
  async listAll(
    request: Request,
    response: Response,
  ): Promise<Response<Account>> {
    const accountRepository = getCustomRepository(AccountRepository);
    let accounts = [];
    try {
      accounts = await accountRepository.find();
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(accounts);
  }

  async listById(
    request: Request,
    response: Response,
  ): Promise<Response<Account>> {
    const accountRepository = getCustomRepository(AccountRepository);
    const { id } = request.params;
    let accounts;

    try {
      accounts = await accountRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(accounts);
  }

  async create(
    request: Request,
    response: Response,
  ): Promise<Response<Account>> {
    const budgetRepository = getCustomRepository(BudgetRepository);
    const accountRepository = getCustomRepository(AccountRepository);
    const data = request.body;

    let account;
    let budget;
    let err;

    try {
      if (!data.budget_id) {
        err = 'Budget is required';
        throw new Error(err as any);
      }

      budget = await budgetRepository.findOne({
        where: { id: data.budget_id },
      });

      account = await accountRepository.create({
        name: data.name,
        amount: data.amount,
        sub_account: data.sub_account,
        type: data.type,
        number_of_installments: data.number_of_installments,
        budget,
      });
      await accountRepository.save(account);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(account);
  }

  async deletById(
    request: Request,
    response: Response,
  ): Promise<Response<Account>> {
    const accountRepository = getCustomRepository(AccountRepository);
    const { id } = request.params;

    try {
      await accountRepository.delete(id);
    } catch (error) {
      return response.json(error);
    }

    return response.status(204);
  }

  async update(
    request: Request,
    response: Response,
  ): Promise<Response<Account>> {
    const accountRepository = getCustomRepository(AccountRepository);
    const { id } = request.params;
    const data = request.body;
    let account: Account | undefined;

    account = await accountRepository.findOne(id);

    try {
      await accountRepository.update(id, {
        name: data.name ? data.name : account?.name,
        amount: data.amount ? data.amount : account?.amount,
        sub_account: data.sub_account ? data.sub_account : account?.sub_account,
        type: data.type ? data.type : account?.type,
        number_of_installments: data.number_of_installments
          ? data.number_of_installments
          : account?.number_of_installments,
        updated_at: new Date(),
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.status(204).json(account);
  }
}
