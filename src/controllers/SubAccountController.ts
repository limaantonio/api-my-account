import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import SubAccountRepository from '../respositories/SubAccountRepository';
import { SubAccount } from '../entities/SubAccount';
import { TypeRole } from '../entities/SubAccount';

interface IResquestSubAccount {
  name: string;
  percentage: number;
  type: TypeRole.INCOME | TypeRole.EXPENSE;
  amount: number;
  principal: boolean;
}

export default class SubAccountController {
  async listById(request: Request, response: Response): Promise<Response> {
    const subAccountRepository = getCustomRepository(SubAccountRepository);
    const { id } = request.params;
    let result: SubAccount | undefined = undefined;

    try {
      result = await subAccountRepository.findOne(id);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }
    return response.json(result);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const subAccountRepository = getCustomRepository(SubAccountRepository);
    const { id } = request.params;
    const data = request.body;
    let result = {};

    try {
      const subAccount = await subAccountRepository.findOne(id);
      if (!subAccount) {
        return response.status(404).json({ message: 'SubAccount not found' });
      }

      const dataIncome = await subAccountRepository.find({
        where: { type: 'INCOME' },
      });

      const totalIncome = dataIncome.reduce((acc, item) => {
        acc += Number(item.amount);
        return acc;
      }, 0);

      const insufficientBalance =
        data.type === 'EXPENSE' && totalIncome < data.amount;

      if (insufficientBalance) {
        return response.json({ message: 'Saldo insuficiente' });
      }

      await subAccountRepository.update(id, data);
      let result: SubAccount | undefined = undefined;
      result = await subAccountRepository.findOne(id);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }
    return response.json(result);
  }

  async create(
    request: Request,
    response: Response,
  ): Promise<Response<IResquestSubAccount[]>> {
    const subAccountRepository = getCustomRepository(SubAccountRepository);
    const data = request.body;
    let result = [];
    let _sub_accounts = Array<SubAccount>();

    try {
      const dataIncome = await subAccountRepository.find({
        where: { type: 'INCOME' },
      });

      const totalIncome = dataIncome.reduce((acc, item) => {
        acc += Number(item.amount);
        return acc;
      }, 0);

      const insufficientBalance = data.some(
        (item: { type: string; amount: number }) =>
          item.type === 'EXPENSE' && totalIncome < item.amount,
      );

      if (insufficientBalance) {
        return response.json({ message: 'Saldo insuficiente' });
      }

      for (const _subAccount of data) {
        let item: SubAccount[] = subAccountRepository.create([_subAccount]);

        _sub_accounts.push(...item);
      }

      result = await subAccountRepository.save(_sub_accounts);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
    return response.json(result);
  }

  async getBalance(request: Request, response: Response): Promise<Response> {
    const subAccountRepository = getCustomRepository(SubAccountRepository);
    let totalAmount = 0;
    let totalLiquidAmount = 0;
    let totalAmountExpense = 0;
    let result = {};

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

      result = {
        income: totalAmount,
        liquid_income: totalLiquidAmount,
        expense: totalAmountExpense,
      };
    } catch (error) {
      console.log(error);
      return response.json(error);
    }
    return response.json(result);
  }

  async deletById(request: Request, response: Response): Promise<Response> {
    const subAccountRepository = getCustomRepository(SubAccountRepository);
    const { id } = request.params;

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
