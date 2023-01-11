import { Item } from '../entities/Item';
import ItemRepository from '../respositories/ItemRepository';
import BudgetRepository from '../respositories/BudgetRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import EntryRepository from '../respositories/EntryRepository';
import { getAvailableValue } from '../services/AccountService';
import AccountRepository from '../respositories/AccountRepository';
import { Account, TypeRole } from '../entities/Account';
import { Entry } from '../entities/Entry';

interface IResquestEntry {
  amount: number;
  entry: Entry;
}

export default class ItemController {
  async listAll(request: Request, response: Response): Promise<Response<Item>> {
    const itemRepository = getCustomRepository(ItemRepository);
    let items = [];
    try {
      items = await itemRepository.find();
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(items);
  }

  async listById(
    request: Request,
    response: Response,
  ): Promise<Response<Item>> {
    const itemRepository = getCustomRepository(ItemRepository);
    const { id } = request.params;
    let items;

    try {
      items = await itemRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(items);
  }

  async create(request: Request, response: Response): Promise<Response<Item>> {
    const itemRepository = getCustomRepository(ItemRepository);
    const entryRepository = getCustomRepository(EntryRepository);
    const accountRepository = getCustomRepository(AccountRepository);
    const data = request.body;
    let item;
    let err;
    let _entry;
    let newEntry;

    try {
      const account = await accountRepository.findOne(data.entry.account_id);
      _entry = await entryRepository.create({
        ...data.entry,
        account,
      });
      newEntry = await entryRepository.save(_entry);

      const accounts = await accountRepository.find();

      accounts.forEach(account => {
        account.entry.forEach(entry => {
          if (entry.id === newEntry?.id) {
            const available = getAvailableValue(account as Account);
            if (
              available.available_value < data.amount &&
              account?.type === 'EXPENSE'
            ) {
              err = 'Insufficient funds';
              throw new Error(err) as never;
            }
          }
        });
      });
      data.items.forEach(async item => {
        item = await itemRepository.create({
          ...item,
          entry: newEntry,
        });
        await itemRepository.save(item);
      });
    } catch (error) {
      console.log(error);
      return response.json({ Error: err });
    }
    return response.json(item);
  }

  async update(request: Request, response: Response): Promise<Response<Item>> {
    const itemRepository = getCustomRepository(ItemRepository);
    const { id } = request.params;
    const data = request.body;

    let item;

    try {
      item = await itemRepository.update(id, {
        ...data,
        updated_at: new Date(),
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.status(204).json(item);
  }
}
