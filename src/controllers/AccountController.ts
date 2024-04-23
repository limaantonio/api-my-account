import { Account } from '../entities/Account';
import AccountRepository from '../respositories/AccountRepository';
import BudgetRepository from '../respositories/BudgetRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { verifyAmountBalance } from '../services/AccountService';
import SubAccountRepository from '../respositories/SubAccountRepository';

interface IResquestAccount {
  name: string;
  amount: number;
  sub_account: string;
  type: string;
  number_of_installments: number;
  budget_id: string;
}

export default class AccountController {
  async getBalance(
    request: Request,
    response: Response,
  ): Promise<Response<Account>> {
    const accountRepository = getCustomRepository(AccountRepository);
    const { id } = request.params;
    let accounts;
    let _accounts;

    try {
      _accounts = await accountRepository.find({
        where: { budget_id: id },
        relations: ['entry', 'sub_account'],
      });

      accounts = verifyAmountBalance(_accounts);

      let income = 0;
      let expense = 0;

      accounts = verifyAmountBalance(_accounts);
      _accounts?.map(account => {
        if (account.sub_account.type === 'INCOME') {
          income += Number(account.amount * account.number_of_installments);
        } else {
          expense += Number(account.amount * account.number_of_installments);
        }
      });

      let _result = {
        income,
        expense,
      };

      return response.json(_result);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }
  }

  async listById(
    request: Request,
    response: Response,
  ): Promise<Response<Account>> {
    const accountRepository = getCustomRepository(AccountRepository);
    const { id } = request.params;
    let accounts;
    let _accounts;

    try {
      _accounts = await accountRepository.find({
        where: { id },
        relations: ['entry'],
      });

      accounts = verifyAmountBalance(_accounts);

      return response.json(accounts);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }
  }

  async listByBudgetId(
    request: Request,
    response: Response,
  ): Promise<Response<Account>> {
    const accountRepository = getCustomRepository(AccountRepository);
    const { id } = request.params;
    let _accounts;
    let accounts;

    try {
      _accounts = await accountRepository.find({
        where: { budget_id: id },
        relations: ['entry', 'sub_account'],
      });

      console.log(_accounts);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }
    let income = 0;
    let expense = 0;

    try {
      accounts = verifyAmountBalance(_accounts);
      _accounts?.map(account => {
        if (account.sub_account.type === 'INCOME') {
          income += Number(account.amount);
        } else {
          expense += Number(account.amount);
        }
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(accounts);
  }

  async createByBudget(
    request: Request,
    response: Response,
  ): Promise<Response<Account>> {
    const accountRepository = getCustomRepository(AccountRepository);
    const budgetRepository = getCustomRepository(BudgetRepository);
    const subAccountRepository = getCustomRepository(SubAccountRepository);
    const data = request.body;
    const { id } = request.params;
    let createdItems: Account[] = [];
    let account;

    try {
      const budget = await budgetRepository.findOne({
        where: { id: id },
      });

      const sub_account = await subAccountRepository.findOne({
        where: { id: data.sub_account_id },
      });

      const accounts = await accountRepository.find({
        where: {
          budget: budget,
          sub_account: sub_account,
        },
      });

      let total = 0;

      if (accounts.length > 0) {
        total = accounts.reduce((acc, account) => {
          return acc + Number(account.amount);
        }, 0);
      }

      if (sub_account && sub_account?.amount < data.amount + total) {
        return response.json({ error: 'Saldo insuficiente' });
      } else {
        account = await accountRepository.create({
          name: data.name,
          amount: data.amount,
          sub_account,
          number_of_installments: data.number_of_installments,
          budget,
        });
        await accountRepository.save(account);
        createdItems.push(account);
      }
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(account);
  }

  async create(
    request: Request,
    response: Response,
  ): Promise<Response<Account>> {
    const budgetRepository = getCustomRepository(BudgetRepository);
    const accountRepository = getCustomRepository(AccountRepository);
    const subAccountRepository = getCustomRepository(SubAccountRepository);
    const data = request.body;
    let createdItems: Account[] = [];
    let account;
    let budget;

    try {
      budget = await budgetRepository.create({
        year: data.budget.year,
      });

      await budgetRepository.save(budget);

      for (const accountData of data.accounts) {
        const sub_account = await subAccountRepository.findOne({
          where: { id: accountData.sub_account_id },
        });

        const accounts = await accountRepository.find({
          where: {
            budget: budget,
            sub_account: sub_account,
          },
        });

        let total = 0;

        if (accounts.length > 0) {
          total = accounts.reduce((acc, account) => {
            return acc + Number(account.amount);
          }, 0);
        }

        if (sub_account && sub_account?.amount < accountData.amount + total) {
          return response.json({ error: 'Saldo insuficiente' });
        } else {
          account = await accountRepository.create({
            name: accountData.name,
            amount: accountData.amount,
            sub_account,
            number_of_installments: accountData.number_of_installments,
            budget,
          });
          await accountRepository.save(account);
          createdItems.push(account);
        }
      }

      await accountRepository.save(createdItems);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(createdItems);
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

    return response.status(204).send();
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
