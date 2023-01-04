import { Entry } from '../entities/Entry';
import EntryRepository from '../respositories/EntryRepository';
import BudgetRepository from '../respositories/BudgetRepository';
import AccountRepository from '../respositories/AccountRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

export default class EntryController {
  async listAll(
    request: Request,
    response: Response,
  ): Promise<Response<Entry>> {
    const entryRepository = getCustomRepository(EntryRepository);
    let entrys = [];
    try {
      entrys = await entryRepository.find();
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(entrys);
  }

  async listById(
    request: Request,
    response: Response,
  ): Promise<Response<Entry>> {
    const entryRepository = getCustomRepository(EntryRepository);
    const { id } = request.params;
    let entrys;

    try {
      entrys = await entryRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(entrys);
  }

  async create(request: Request, response: Response): Promise<Response<Entry>> {
    const budgetRepository = getCustomRepository(BudgetRepository);
    const accountRepository = getCustomRepository(AccountRepository);
    const entryRepository = getCustomRepository(EntryRepository);
    const data = request.body;

    let entry;
    let budget;
    let account;

    try {
      budget = await budgetRepository.findOne({
        where: { id: data.budget_id },
      });

      account = await accountRepository.findOne({
        where: { id: data.account_id },
      });

      entry = await entryRepository.create({
        ...data,
        account,
        budget,
      });

      await entryRepository.save(entry);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(entry);
  }

  async deletById(
    request: Request,
    response: Response,
  ): Promise<Response<Entry>> {
    const entryRepository = getCustomRepository(EntryRepository);
    const { id } = request.params;

    try {
      await entryRepository.delete(id);
    } catch (error) {
      return response.json(error);
    }

    return response.status(204);
  }

  async update(request: Request, response: Response): Promise<Response<Entry>> {
    const entryRepository = getCustomRepository(EntryRepository);
    const { id } = request.params;
    const data = request.body;

    let entry = await entryRepository.findOne(id);

    try {
      entry = await entryRepository.update(id, {
        description: data.description ? data.description : entry?.description,
        amount: data.amount ? data.amount : entry?.amount,
        installment: data.installment ? data.installment : entry?.installment,
        number_of_installments: data.number_of_installments
          ? entry?.number_of_installments
          : entry?.number_of_installments,
        balance: data.balance ? data.balance : entry?.balance,
        account: data.account ? data.account : entry?.account,
        updated_at: new Date(),
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.status(204).json(entry);
  }
}
