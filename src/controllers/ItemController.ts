import { Item } from '../entities/Item';
import ItemRepository from '../respositories/ItemRepository';
import BudgetRepository from '../respositories/BudgetRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import EntryRepository from '../respositories/EntryRepository';

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
    const data = request.body;

    let item;
    let err;

    try {
      if (!data.entry_id) {
        err = 'entry_id is required';
        throw new Error(err) as never;
      } else {
        let entry = await entryRepository.findOne(data.entry_id);
        item = await itemRepository.create({
          ...data,
          entry,
        });
      }

      await itemRepository.save(item);
    } catch (error) {
      console.log(error);
      return response.json(error);
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
