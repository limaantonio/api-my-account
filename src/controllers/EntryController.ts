import { Entry, TypeRole } from '../entities/Entry';
import EntryRepository from '../respositories/EntryRepository';
import { query, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import AccountRepository from '../respositories/AccountRepository';
import { getItemsAmount } from '../services/ItemsService';
import { getAvailableValue } from '../services/BudgetMonthService';
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
      });
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(entrys);
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
    let entries = []

    try {
      monthBudget = await monthBudgetRepository.findOne({
        where: { id },
      });

      entrys = await entryRepository.find({
        where: { budget_month: monthBudget },
        relations: ['account'],
      });

      
    } catch (error) {
      console.log(error);
      return response.json(error);
    }

    return response.json(entrys);
  }

  async create(request: Request, response: Response): Promise<Response<IResquestEntry>> {
    const entryRepository = getCustomRepository(EntryRepository);
    const accountRepository = getCustomRepository(AccountRepository);
    const budgetRepository = getCustomRepository(BudgetRepository);
    const budgetMonthRepository = getCustomRepository(BudgetMonthRepository);
    const { description, installment, budget_month_id, account_id } = request.body as IResquestEntry;
    let _entry;
    let budget;
    let account;
    let budget_month;

    try {

      budget_month = await budgetMonthRepository.findOne({
        where: { id: budget_month_id },
      });

      budget = await budgetRepository.findOne({
        where: { id: budget_month?.budget?.id },
      });


      account = await accountRepository.findOne({
        where: { id: account_id },

      });

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
