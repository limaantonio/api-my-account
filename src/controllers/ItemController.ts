import { Item } from '../entities/Item';
import ItemRepository from '../respositories/ItemRepository';
import BudgetRepository from '../respositories/BudgetRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import EntryRepository from '../respositories/EntryRepository';
import {
  getTotalAmountExpense,
  getTotalExpanse,
} from '../services/BudgetMonthService';
import AccountRepository from '../respositories/AccountRepository';
import { Entry } from '../entities/Entry';
import BudgetMonthRepository from '../respositories/BudgetMonthRepository';

interface IResquestEntry {
  amount: number;
  entry: Entry;
  budget_month_id: string;
  account_id: string;
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

  async create(
    request: Request,
    response: Response,
  ): Promise<Response<Item[]>> {
    const itemRepository = getCustomRepository(ItemRepository);
    const entryRepository = getCustomRepository(EntryRepository);
    const budgetRepository = getCustomRepository(BudgetRepository);
    const accountRepository = getCustomRepository(AccountRepository);
    const budgetMonthRepository = getCustomRepository(BudgetMonthRepository);
    const data = request.body;
    let createdItems: Item[] = [];
    let err;
    let budget_month;
    let budget;

    try {
      budget_month = await budgetMonthRepository.findOne({
        where: { id: data.entry?.budget_month_id },
        relations: ['entry'],
      });

      budget = await budgetRepository.findOne({
        where: { id: budget_month?.budget?.id },
      });

      const account = await accountRepository.findOne({
        where: { id: data.entry.account_id },
      });

      const newEntry = await entryRepository.create({
        ...data.entry,
        account,
        budget_month,
      });
      const savedEntry = await entryRepository.save(newEntry);

      let value = 0;
      for (const itemData of data.items) {
        value += Number(itemData.amount);
      }

      if (
        account &&
        account.sub_account?.type === 'EXPENSE' &&
        budget_month &&
        value <= getTotalAmountExpense(budget_month).valueOf()
      ) {
        err = 'Insufficient funds';
        await entryRepository.delete(savedEntry[0].id);
      } else {
        for (const itemData of data.items) {
          const item = await itemRepository.create({
            ...itemData,
            entry: savedEntry,
          });
          const savedItem = await itemRepository.save(item);
          createdItems = savedItem; // Fix: Change the type of createdItems from Item[] to Item
        }
      }
    } catch (error) {
      console.error('Error:', error);
      return response.status(500).json({ error: 'Internal Server Error' });
    }

    if (err) {
      return response.status(400).json({ error: err });
    } else {
      return response.json(createdItems);
    }
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
