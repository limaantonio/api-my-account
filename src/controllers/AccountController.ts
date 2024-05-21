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
  async list(request: Request, response: Response): Promise<Response<Account>> {
    const accountRepository = getCustomRepository(AccountRepository);
    let accounts;

    try {
      accounts = await accountRepository.find();
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(accounts);
  }

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
        relations: ['sub_account'],
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

  async listOneAccount(
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

    console.log(id);

    try {
      _accounts = await accountRepository.find();
      console.log(_accounts);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }
    let income = 0;
    let expense = 0;

    try {
      accounts = verifyAmountBalance(_accounts);
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

      if (budget === undefined)
        return response.json({ error: 'Orçamento não encontrado' });

      for (const _account of data) {
        const sub_account = await subAccountRepository.findOne({
          where: { id: _account.sub_account_id },
        });

        console.log(sub_account);

        if (sub_account === undefined) {
          return response.json({ error: 'sub_account não encontrada' });
        }

        const accounts = await accountRepository.find({
          where: {
            sub_account: sub_account,
          },
        });

        let total = 0;

        if (accounts.length > 0) {
          total = accounts.reduce((acc, account) => {
            return acc + Number(account.amount);
          }, 0);
        }

        if (
          sub_account &&
          sub_account?.amount < Number(_account.amount) + total
        ) {
          return response.status(400).json({ error: 'Saldo insuficiente' });
        } else {
          //@ts-ignore
          account = accountRepository.create({
            name: _account.name,
            amount: _account.amount,
            sub_account,
            number_of_installments: _account.number_of_installments,
            budget: budget, // Add the 'budget' property
          });
          await accountRepository.save(account);
          createdItems.push(account);
        }
      }
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(createdItems);
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
      const _budget = await budgetRepository.findOne({
        where: { year: data.budget.year },
      });

      if (_budget) {
        return response.json({ error: 'Orçamento já cadastrado' });
      } else {
        budget = await budgetRepository.create({
          year: data.budget.year,
        });
      }

      for (const accountData of data.accounts) {
        const sub_account = await subAccountRepository.findOne({
          where: { id: accountData.sub_account_id },
        });

        console.log(sub_account);

        const accounts = await accountRepository.find({
          where: {
            sub_account: sub_account,
          },
        });

        let total = 0;

        //console.log(accounts);

        if (accounts.length > 0) {
          total = accounts.reduce((acc, account) => {
            return acc + Number(account.amount);
          }, 0);
        }

        //console.log(total);

        if (sub_account && sub_account?.amount > accountData.amount + total) {
          return response.status(400).json({ error: 'Saldo insuficiente' });
        } else {
          budget = await budgetRepository.save(budget);
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
    const subAccountRepository = getCustomRepository(SubAccountRepository);
    const { id } = request.params;
    const data = request.body;
    let account: Account | undefined;

    account = await accountRepository.findOne(id);
    const sub_account = await subAccountRepository.findOne({
      where: { id: data.sub_account_id },
    });

    try {
      await accountRepository.update(id, {
        name: data.name ? data.name : account?.name,
        amount: data.amount ? data.amount : account?.amount,
        sub_account: sub_account ? sub_account : account?.sub_account,
        number_of_installments: data.number_of_installments
          ? data.number_of_installments
          : account?.number_of_installments,
        updated_at: new Date(),
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.status(200).json(account);
  }
}
