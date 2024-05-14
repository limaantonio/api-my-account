import { Entry, TypeRole } from '../entities/Entry';
import EntryRepository from '../respositories/EntryRepository';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import AccountRepository from '../respositories/AccountRepository';
import BudgetMonthRepository from '../respositories/BudgetMonthRepository';
import { BudgetMonth } from '../entities/BudgetMonth';
import { Account } from '../entities/Account';
import BudgetRepository from '../respositories/BudgetRepository';

interface IResquestEntry {
  description: string;
  installment: number;
  status: TypeRole.PENDING;
  budget_month_id: string;
  account_id: string;
}

export default class EntryController {
  // async listAll(
  //   request: Request,
  //   response: Response,
  // ): Promise<Response<Entry>> {
  //   const entryRepository = getCustomRepository(EntryRepository);
  //   let entrys = [];
  //   let result = [];
  //   let income = 0;
  //   let expense = 0;
  //   try {
  //     if (request.query.account && request.query.month) {
  //       entrys = await entryRepository.query(
  //         `
  //           SELECT row_to_json(account)  as account_entries
  //           FROM (
  //             SELECT
  //               account.id,
  //               account.name,
  //               account.type,
  //               account.sub_account,
  //               account.amount,
  //               (
  //                 SELECT json_agg(entry)
  //                 FROM (
  //                   SELECT
  //                     entry.id,
  //                     entry.description,
  //                     entry.installment,
  //                     entry.month,
  //                     entry.status,
  //                     (
  //                       SELECT json_agg(item)
  //                       FROM (
  //                         SELECT
  //                           item.*
  //                         FROM
  //                           item
  //                         WHERE
  //                           item.entry_id = entry.id
  //                       ) item
  //                     ) as item,
  //                     (
  //                       SELECT
  //                         sum(item.amount) as amount
  //                       FROM
  //                       item
  //                       WHERE
  //                       item.entry_id = entry.id
  //                     ) as amount
  //                   FROM entry
  //                   WHERE entry.account_id = account.id AND entry.month = $1
  //                 ) entry
  //               ) as entry
  //             FROM account
  //             WHERE account.id = $2
  //           ) account`,
  //         [`${request.query.month}`, `${request.query.account}`],
  //       );
  //     } else if (request.query.month) {
  //       entrys = await entryRepository.query(
  //         `
  //           SELECT row_to_json(account)  as account_entries
  //           FROM (
  //             SELECT
  //               account.id,
  //               account.name,
  //               account.type,
  //               account.sub_account,
  //               account.amount,
  //               (
  //                 SELECT json_agg(entry)
  //                 FROM (
  //                   SELECT
  //                     entry.id,
  //                     entry.description,
  //                     entry.installment,
  //                     entry.month,
  //                     entry.status,
  //                     (
  //                       SELECT json_agg(item)
  //                       FROM (
  //                         SELECT
  //                           item.*
  //                         FROM
  //                           item
  //                         WHERE
  //                           item.entry_id = entry.id
  //                       ) item
  //                     ) as item,
  //                     (
  //                       SELECT
  //                         sum(item.amount) as amount
  //                       FROM
  //                       item
  //                       WHERE
  //                       item.entry_id = entry.id
  //                     ) as amount
  //                   FROM entry
  //                   WHERE entry.account_id = account.id AND entry.month = $1
  //                 ) entry
  //               ) as entry
  //             FROM account
  //           ) account`,
  //         [`${request.query.month}`],
  //       );
  //     } else if (request.query.account) {
  //       entrys = await entryRepository.query(
  //         `
  //           SELECT row_to_json(account)  as account_entries
  //           FROM (
  //             SELECT
  //               account.id,
  //               account.name,
  //               account.type,
  //               account.sub_account,
  //               account.amount,
  //               (
  //                 SELECT json_agg(entry)
  //                 FROM (
  //                   SELECT
  //                     entry.id,
  //                     entry.description,
  //                     entry.installment,
  //                     entry.month,
  //                     entry.status,
  //                     (
  //                       SELECT json_agg(item)
  //                       FROM (
  //                         SELECT
  //                           item.*
  //                         FROM
  //                           item
  //                         WHERE
  //                           item.entry_id = entry.id
  //                       ) item
  //                     ) as item,
  //                     (
  //                       SELECT
  //                         sum(item.amount) as amount
  //                       FROM
  //                       item
  //                       WHERE
  //                       item.entry_id = entry.id
  //                     ) as amount
  //                   FROM entry
  //                   WHERE entry.account_id = account.id
  //                 ) entry
  //               ) as entry
  //             FROM account
  //             WHERE account.id = $1
  //           ) account`,
  //         [`${request.query.account}`],
  //       );
  //     } else {
  //       entrys = await entryRepository.query(
  //         `
  //             SELECT row_to_json(account)  as account_entries
  //             FROM (
  //               SELECT
  //                 account.id,
  //                 account.name,
  //                 account.type,
  //                 account.sub_account,
  //                 account.amount,
  //                 (
  //                   SELECT json_agg(entry)
  //                   FROM (
  //                     SELECT
  //                       entry.id,
  //                       entry.description,
  //                       entry.installment,
  //                       entry.month,
  //                       entry.status,
  //                       (
  //                         SELECT json_agg(item)
  //                         FROM (
  //                           SELECT
  //                             item.*
  //                           FROM
  //                             item
  //                           WHERE
  //                             item.entry_id = entry.id
  //                         ) item
  //                       ) as item,
  //                       (
  //                         SELECT
  //                           sum(item.amount) as amount
  //                         FROM
  //                         item
  //                         WHERE
  //                         item.entry_id = entry.id
  //                       ) as amount
  //                     FROM entry
  //                     WHERE entry.account_id = account.id
  //                   ) entry
  //                 ) as entry
  //               FROM account
  //             ) account`,
  //       );
  //     }

  //     entrys?.map(account => {
  //       account?.account_entries?.entry?.map(entry => {
  //         if (account?.account_entries?.type === 'INCOME') {
  //           income += Number(entry.amount);
  //         } else {
  //           expense += Number(entry.amount);
  //         }
  //       });
  //     });

  //     result = {
  //       income,
  //       expense,
  //       entrys,
  //     };

  //     // entrys.forEach(entry => {
  //     //   amount = getItemsAmount(entry);
  //     //   result.push({ ...entry, amount });
  //     // });
  //   } catch (error) {
  //     console.log(error);
  //     return response.json(error);
  //   }

  //   return response.json(result);
  // }

  async listAll(request: Request, response: Response): Promise<Response> {
    const entryRepository = getCustomRepository(EntryRepository);
    let result: Entry[] = [];
    let entry = [];
    const { type } = request.query;

    try {
      entry = await entryRepository.find({
        relations: ['budget_month'],
      });
      console.log(type);
      if (type !== undefined) {
        entry.map(entry => {
          if (entry.account.sub_account.type === type) {
            result.push(entry);
          }
        });
      } else {
        result = entry;
      }
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
    let entry;

    try {
      entry = await entryRepository.findOne({
        where: { id },
        relations: ['account', 'budget_month'],
      });

      let total = 0;
      entry?.items.map(item => {
        total += Number(item.amount);
      });

      // @ts-ignore
      entry?.amount = total;
      total = 0;
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(entry);
  }

  async listByMonthId(
    request: Request,
    response: Response,
  ): Promise<Response<Entry>> {
    const entryRepository = getCustomRepository(EntryRepository);
    const monthBudgetRepository = getCustomRepository(BudgetMonthRepository);
    const { id } = request.params;
    let entrys;
    let account;
    let result;
    let _entry;
    let monthBudget;
    let entries = [];

    try {
      monthBudget = await monthBudgetRepository.findOne({
        where: { id },
      });

      entrys = await entryRepository.find({
        where: { budget_month: monthBudget },
        relations: ['account'],
      });

      let total = 0;
      entrys.map(entry => {
        entry.items.map(item => {
          total += Number(item.amount);
        });
        // @ts-ignore
        entry.amount = total;
        entries.push(entry);
        total = 0;
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(entrys);
  }

  async create(
    request: Request,
    response: Response,
  ): Promise<Response<IResquestEntry>> {
    const entryRepository = getCustomRepository(EntryRepository);
    const accountRepository = getCustomRepository(AccountRepository);
    const budgetRepository = getCustomRepository(BudgetRepository);
    const budgetMonthRepository = getCustomRepository(BudgetMonthRepository);
    const { description, installment, budget_month_id, account_id } =
      request.body as IResquestEntry;
    let _entry;
    let budget;
    let account;
    let budget_month;

    try {
      budget_month = await budgetMonthRepository.findOne({
        where: { id: budget_month_id },
      });

      if (!budget_month) {
        return response.status(404).json({ message: 'Budget month not found' });
      } else {
        budget = await budgetRepository.findOne({
          where: { id: budget_month?.budget.id },
        });
      }

      account = await accountRepository.findOne({
        where: { id: account_id },
      });

      // @ts-ignore
      _entry = await entryRepository.create({
        description,
        installment,
        status: 'PENDING',
        budget_month: budget_month as BudgetMonth,
        account: account as Account,
      });

      await entryRepository.save(_entry);
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(_entry);
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
        // @ts-ignore
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
