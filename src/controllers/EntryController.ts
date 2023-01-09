import { Entry } from '../entities/Entry';
import EntryRepository from '../respositories/EntryRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import AccountRepository from '../respositories/AccountRepository';
import { getItemsAmount } from '../services/ItemsService';

export default class EntryController {
  async listAll(
    request: Request,
    response: Response,
  ): Promise<Response<Entry>> {
    const entryRepository = getCustomRepository(EntryRepository);
    let entrys = [];
    let result = [];
    let amount;
    try {
      entrys = await entryRepository.find();
      entrys.forEach(entry => {
        amount = getItemsAmount(entry);
        result.push({ ...entry, amount });
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(result);
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
    const accountRepository = getCustomRepository(AccountRepository);
    const entryRepository = getCustomRepository(EntryRepository);
    const data = request.body;

    let entry;
    let account;
    let err;

    try {
      if (!data.account_id) {
        err = 'Account is required';
        throw new Error(err) as never;
      }

      account = await accountRepository.findOne({
        where: { id: data.account_id },
      });

      entry = await entryRepository.create({
        ...data,
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
        updated_at: new Date(),
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.status(204).json(entry);
  }
}
