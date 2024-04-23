import { Account } from '../entities/Account';
import AccountRepository from '../respositories/AccountRepository';
import BudgetRepository from '../respositories/BudgetRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { verifyAmountBalance } from '../services/AccountService';
import {Entry} from '../entities/Entry'
import EntryRepository from '../respositories/EntryRepository'
import SubAccountRepository from '../respositories/SubAccountRepository';

interface IResquestAccount {
  amount: number;
  account: Account;
}

export default class SubAccountController {
  async create (
    request: Request,
    response: Response,
  ): Promise<Response<Account>> {
    const subAccountRepository = getCustomRepository(SubAccountRepository);
    const data = request.body;
    let result = [];
    let _sub_accounts = [];

    try {

      const dataIncome = await subAccountRepository.find({where: {type: 'INCOME'}});

      const totalIncome = dataIncome.reduce((acc, item) => {
        acc += Number(item.amount);
        return acc;
      }, 0);

      // Check if totalIncome is sufficient for all expenses
      const insufficientBalance = data.some(item => item.type === 'EXPENSE' && totalIncome < item.amount);
      if (insufficientBalance) {
        return response.json({message: 'Saldo insuficiente'});
      }

      // Create sub accounts
      for (const _subAccount of data) {
        const item = subAccountRepository.create(_subAccount);
        _sub_accounts.push(item);
      }

      // Save sub accounts to the database
      result = await subAccountRepository.save(_sub_accounts);
      
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Internal Server Error' });
    }

    return response.json(result);
  }


  async getBalance(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const subAccountRepository = getCustomRepository(SubAccountRepository);
    let totalAmount = 0;
    let totalLiquidAmount = 0;
    let totalAmountExpense = 0;

    try {
      const subaccount = await subAccountRepository.find();
      
      totalLiquidAmount = subaccount.reduce((acc, item) => {
        //pega so as receitas principais (salario)
        if (item.type === 'INCOME' && item.principal === true) {
          acc += Number(item.amount);
        }
        return acc;
      }, 0);

      totalAmount = subaccount.reduce((acc, item) => {
        if (item.type === 'INCOME') {
          acc += Number(item.amount);
        }
        return acc;
      }, 0);

      totalAmountExpense = subaccount.reduce((acc, item) => {
        if (item.type === 'EXPENSE') {
          acc += Number(item.amount);
        }
        return acc;
      }, 0);

      const result = {
        "income" : totalAmount,
        "liquid_income" : totalLiquidAmount,
        "expense" : totalAmountExpense,
      };

    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(result);
  }

  async deletById(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const subAccountRepository = getCustomRepository(SubAccountRepository);
    const { id } = request.params;
    let result = [];

    try {
      const subAccount = await subAccountRepository.findOne(id);
      if (!subAccount) {
        return response.status(404).json({ message: 'SubAccount not found' });
      }

      await subAccountRepository.delete(id);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.sendStatus(204);
  }

  async listSubAccount(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const subAccountRepository = getCustomRepository(SubAccountRepository);
    let result = [];

    try {
      result = await subAccountRepository.find();
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(result);
  }
  
}