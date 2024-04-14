import { Entry } from '../entities/Entry';
import EntryRepository from '../respositories/EntryRepository';
import { query, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import AccountRepository from '../respositories/AccountRepository';
import { getItemsAmount } from '../services/ItemsService';
import { getAvailableValue } from '../services/AccountService';

export default class EntryController {
  async listAll(
    request: Request,
    response: Response,
  ): Promise<Response<Entry>> {
    const entryRepository = getCustomRepository(EntryRepository);
    let entrys = [];
    let result = [];
    let amount;
    let income = 0;
    let expense = 0;
    try {
      if (request.query.account && request.query.month) {
        entrys = await entryRepository.query(
          `
            SELECT row_to_json(account)  as account_entries
            FROM (
              SELECT 
                account.id,
                account.name,
                account.type,
                account.sub_account,
                account.amount,
                (
                  SELECT json_agg(entry)
                  FROM (
                    SELECT
                      entry.id,
                      entry.description,
                      entry.installment,
                      entry.month,
                      entry.status,
                      (
                        SELECT json_agg(item)
                        FROM (
                          SELECT
                            item.*
                          FROM
                            item
                          WHERE
                            item.entry_id = entry.id
                        ) item
                      ) as item,
                      (
                        SELECT
                          sum(item.amount) as amount
                        FROM
                        item
                        WHERE
                        item.entry_id = entry.id
                      ) as amount
                    FROM entry
                    WHERE entry.account_id = account.id AND entry.month = $1
                  ) entry
                ) as entry
              FROM account
              WHERE account.id = $2
            ) account`,
          [`${request.query.month}`, `${request.query.account}`],
        );
      } else if (request.query.month) {
        entrys = await entryRepository.query(
          `
            SELECT row_to_json(account)  as account_entries
            FROM (
              SELECT 
                account.id,
                account.name,
                account.type,
                account.sub_account,
                account.amount,
                (
                  SELECT json_agg(entry)
                  FROM (
                    SELECT
                      entry.id,
                      entry.description,
                      entry.installment,
                      entry.month,
                      entry.status,
                      (
                        SELECT json_agg(item)
                        FROM (
                          SELECT
                            item.*
                          FROM
                            item
                          WHERE
                            item.entry_id = entry.id
                        ) item
                      ) as item,
                      (
                        SELECT
                          sum(item.amount) as amount
                        FROM
                        item
                        WHERE
                        item.entry_id = entry.id
                      ) as amount
                    FROM entry
                    WHERE entry.account_id = account.id AND entry.month = $1
                  ) entry
                ) as entry
              FROM account
            ) account`,
          [`${request.query.month}`],
        );
      } else if (request.query.account) {
        entrys = await entryRepository.query(
          `
            SELECT row_to_json(account)  as account_entries
            FROM (
              SELECT 
                account.id,
                account.name,
                account.type,
                account.sub_account,
                account.amount,
                (
                  SELECT json_agg(entry)
                  FROM (
                    SELECT
                      entry.id,
                      entry.description,
                      entry.installment,
                      entry.month,
                      entry.status,
                      (
                        SELECT json_agg(item)
                        FROM (
                          SELECT
                            item.*
                          FROM
                            item
                          WHERE
                            item.entry_id = entry.id
                        ) item
                      ) as item,
                      (
                        SELECT
                          sum(item.amount) as amount
                        FROM
                        item
                        WHERE
                        item.entry_id = entry.id
                      ) as amount
                    FROM entry
                    WHERE entry.account_id = account.id
                  ) entry
                ) as entry
              FROM account
              WHERE account.id = $1
            ) account`,
          [`${request.query.account}`],
        );
      } else {
        entrys = await entryRepository.query(
          `
              SELECT row_to_json(account)  as account_entries
              FROM (
                SELECT 
                  account.id,
                  account.name,
                  account.type,
                  account.sub_account,
                  account.amount,
                  (
                    SELECT json_agg(entry)
                    FROM (
                      SELECT
                        entry.id,
                        entry.description,
                        entry.installment,
                        entry.month,
                        entry.status,
                        (
                          SELECT json_agg(item)
                          FROM (
                            SELECT
                              item.*
                            FROM
                              item
                            WHERE
                              item.entry_id = entry.id
                          ) item
                        ) as item,
                        (
                          SELECT
                            sum(item.amount) as amount
                          FROM
                          item
                          WHERE
                          item.entry_id = entry.id
                        ) as amount
                      FROM entry
                      WHERE entry.account_id = account.id
                    ) entry
                  ) as entry
                FROM account
              ) account`,
        );
      }

      entrys?.map(account => {
        account?.account_entries?.entry?.map(entry => {
          if (account?.account_entries?.type === 'INCOME') {
            income += Number(entry.amount);
          } else {
            expense += Number(entry.amount);
          }
        });
      });

      result = {
        income,
        expense,
        entrys,
      };

      // entrys.forEach(entry => {
      //   amount = getItemsAmount(entry);
      //   result.push({ ...entry, amount });
      // });
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
        relations: ['account'],
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(entrys);
  }

  async listByAccountId(
    request: Request,
    response: Response,
  ): Promise<Response<Entry>> {
    const entryRepository = getCustomRepository(EntryRepository);
    const accountRepository = getCustomRepository(AccountRepository);
    const { id } = request.params;
    let entrys;
    let account;
    let result;
    let _entry;
    let amount;
    let entries = []

    try {
      
      entrys = await entryRepository.find({
        where: { account_id: id },
        relations: ['account'],
      });

      let entry_amount ;

      entrys?.map(entry => {
        entry_amount = getItemsAmount(entry);
        _entry = { entry_amount, ...entry};
        entry = {
          _entry
        }
        entries.push(_entry);
      

      });
      
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(entries);
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

    return response.status(204).send();
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
        status: data.status ? data.status : entry?.status,
        month: data.month ? data.month : entry?.month,
        updated_at: new Date(),
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.status(204).json(entry);
  }

  async pay(request: Request, response: Response): Promise<Response<Entry>> {
    const entryRepository = getCustomRepository(EntryRepository);
    const { id } = request.params;

    try {
      await entryRepository.update(id, {
        status: 'CLOSED',
        updated_at: new Date(),
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }
    return response.status(204).json({ message: 'Entry paid' });
  }
}
