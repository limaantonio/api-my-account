import request from 'supertest';
import { describe } from '@jest/globals';
import { Account } from '../../entities/Account';
import { TypeRole } from '../../entities/Account';
import { Budget } from '../../entities/Budget';
import { Balance } from '../../entities/Balance';
import { Entry } from '../../entities/Entry';
import { Item } from '../../entities/Item';
import { getAmount, getResult } from '../../services/BalanceService';

describe('shold be to get balance', () => {
  it('should be to get income type balance', async () => {
    let account = new Account();
    account.amount = 100;
    account.type = TypeRole.INCOME;
    account.name = 'Salário';
    account.sub_account = TypeRole.WAGE;
    account.number_of_installments = 12;

    let budget = new Budget();
    budget.year = 2021;
    budget.accounts = [account];

    let item = new Item();
    item.amount = 100;
    item.name = 'Salário';
    item.qtde = 1;

    let entry = new Entry();
    entry.description = 'Salário';
    entry.installment = 1;
    entry.items = [item];
    entry.account = account;

    let balance = new Balance();
    balance.month = 1;
    balance.entries = [entry];

    const incomeAmount = getAmount(balance, TypeRole.INCOME);

    expect(incomeAmount).toBe(100);
  });

  it('should be to get expense type balance', async () => {
    let account = new Account();
    account.amount = 100;
    account.type = TypeRole.EXPENSE;
    account.name = 'IPVA';
    account.sub_account = TypeRole.INTEREST_AND_CHARGES;
    account.number_of_installments = 11;

    let budget = new Budget();
    budget.year = 2021;
    budget.accounts = [account];

    let item = new Item();
    item.amount = 100;
    item.name = 'Ipva';
    item.qtde = 1;

    let entry = new Entry();
    entry.description = 'Ipva';
    entry.installment = 1;
    entry.items = [item];
    entry.account = account;

    let balance = new Balance();
    balance.month = 1;
    balance.entries = [entry];

    const incomeAmount = getAmount(balance, TypeRole.EXPENSE);

    expect(incomeAmount).toBe(100);
  });

  it('should be to get result balance', async () => {
    let account = new Account();
    account.amount = 100;
    account.type = TypeRole.EXPENSE;
    account.name = 'IPVA';
    account.sub_account = TypeRole.INTEREST_AND_CHARGES;
    account.number_of_installments = 11;

    let budget = new Budget();
    budget.year = 2021;

    let item = new Item();
    item.amount = 100;
    item.name = 'Ipva';
    item.qtde = 1;

    let entry = new Entry();
    entry.description = 'Ipva';
    entry.installment = 1;
    entry.items = [item];
    entry.account = account;

    let balance = new Balance();
    balance.month = 1;

    let account2 = new Account();
    account2.amount = 100;
    account2.type = TypeRole.INCOME;
    account2.name = 'Salário';
    account2.sub_account = TypeRole.WAGE;
    account2.number_of_installments = 12;

    budget.accounts = [account, account2];

    let item2 = new Item();
    item2.amount = 100;
    item2.name = 'Salário';
    item2.qtde = 1;

    let entry2 = new Entry();
    entry2.description = 'Salário';
    entry2.installment = 1;
    entry2.items = [item2];
    entry2.account = account2;

    balance.entries = [entry, entry2];

    const incomeAmount = getResult(balance);

    expect(incomeAmount).toBe(0);
  });

  it('should be to get balance', async () => {
    let account = new Account();
    account.amount = 100;
    account.type = TypeRole.EXPENSE;
    account.name = 'IPVA';
    account.sub_account = TypeRole.INTEREST_AND_CHARGES;
    account.number_of_installments = 11;

    let budget = new Budget();
    budget.year = 2021;

    let item = new Item();
    item.amount = 100;
    item.name = 'Ipva';
    item.qtde = 1;

    let entry = new Entry();
    entry.description = 'Ipva';
    entry.installment = 1;
    entry.items = [item];
    entry.account = account;

    let balance = new Balance();
    balance.month = 1;

    let account2 = new Account();
    account2.amount = 100;
    account2.type = TypeRole.INCOME;
    account2.name = 'Salário';
    account2.sub_account = TypeRole.WAGE;
    account2.number_of_installments = 12;

    budget.accounts = [account, account2];

    let item2 = new Item();
    item2.amount = 100;
    item2.name = 'Salário';
    item2.qtde = 1;

    let entry2 = new Entry();
    entry2.description = 'Salário';
    entry2.installment = 1;
    entry2.items = [item2];
    entry2.account = account2;

    balance.entries = [entry, entry2];

    const result = getResult(balance);

    expect(result).toBe(0);
  });
});
