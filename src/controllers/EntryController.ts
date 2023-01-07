import { Entry } from '../entities/Entry';
import EntryRepository from '../respositories/EntryRepository';
import BalanceRepository from '../respositories/BalanceRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import AccountRepository from '../respositories/AccountRepository';

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
    const balanceRepository = getCustomRepository(BalanceRepository);
    const accountRepository = getCustomRepository(AccountRepository);
    const entryRepository = getCustomRepository(EntryRepository);
    const data = request.body;

    let entry;
    let balance;
    let account;
    let err;

    try {
      if (!data.balance_id) {
        err = 'Balance is required';
        throw new Error(err) as never;
      }

      if (!data.account_id) {
        err = 'Account is required';
        throw new Error(err) as never;
      }

      balance = await balanceRepository.findOne({
        where: { id: data.balance_id },
      });

      account = await accountRepository.findOne({
        where: { id: data.account_id },
      });

      entry = await entryRepository.create({
        ...data,
        balance,
        account,
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
      await entryRepository.update(id, {
        description: data.description ? data.description : entry?.description,
        installment: data.installment ? data.installment : entry?.installment,
        balance: data.balance ? data.balance : entry?.balance,
        updated_at: new Date(),
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.status(204).json(entry);
  }
}
