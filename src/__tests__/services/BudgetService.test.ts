import { describe } from '@jest/globals';
import { Account, TypeRole } from '../../entities/Account';
import { Budget } from '../../entities/Budget';
import {
  getTotalAmountIncome,
  getTotalAmountExpense,
  getSummary,
  getTotalAccount,
  getTotalExpanse,
  getTotalIncome,
} from '../../services/BudgetService';

describe('Test budget services', () => {
  test('should return total of income', async () => {
    let account = new Account();
    account.amount = 100;
    account.type = TypeRole.INCOME;
    account.name = 'Salário';
    account.sub_account = TypeRole.WAGE;
    account.number_of_installments = 12;

    let account2 = new Account();
    account2.amount = 50;
    account2.type = TypeRole.INCOME;
    account2.name = '13º';
    account2.sub_account = TypeRole.WAGE;
    account2.number_of_installments = 12;

    let budget = new Budget();
    budget.year = 2021;
    budget.accounts = [account, account2];

    const total_income = getTotalAmountIncome(budget);

    expect(total_income).toBe(150);
  });

  test('should return total of expense', async () => {
    let account = new Account();
    account.amount = 100;
    account.type = TypeRole.EXPENSE;
    account.name = 'IPVA';
    account.sub_account = TypeRole.INTEREST_AND_CHARGES;
    account.number_of_installments = 1;

    let account2 = new Account();
    account2.amount = 50;
    account2.type = TypeRole.EXPENSE;
    account2.name = 'Licenciamento';
    account2.sub_account = TypeRole.INTEREST_AND_CHARGES;
    account2.number_of_installments = 1;

    let budget = new Budget();
    budget.year = 2021;
    budget.accounts = [account, account2];

    const total_income = getTotalAmountExpense(budget);

    expect(total_income).toBe(150);
  });

  test('should return total of budget', async () => {
    let account = new Account();
    account.amount = 100;
    account.type = TypeRole.EXPENSE;
    account.name = 'IPVA';
    account.sub_account = TypeRole.INTEREST_AND_CHARGES;
    account.number_of_installments = 1;

    let account2 = new Account();
    account2.amount = 50;
    account2.type = TypeRole.EXPENSE;
    account2.name = 'Licenciamento';
    account2.sub_account = TypeRole.INTEREST_AND_CHARGES;
    account2.number_of_installments = 1;

    let account3 = new Account();
    account3.amount = 100;
    account3.type = TypeRole.INCOME;
    account3.name = 'Salário';
    account3.sub_account = TypeRole.WAGE;
    account3.number_of_installments = 12;

    let account4 = new Account();
    account4.amount = 50;
    account4.type = TypeRole.INCOME;
    account4.name = '13º';
    account4.sub_account = TypeRole.WAGE;
    account4.number_of_installments = 12;

    let budget = new Budget();
    budget.year = 2021;
    budget.accounts = [account, account2, account3, account4];

    const total_income = getTotalAmountIncome(budget);
    const total_expense = getTotalAmountExpense(budget);
    const sumary = Number(total_income) - Number(total_expense);

    expect(sumary).toBe(0);
  });

  test('should return quantity of installments', async () => {
    let account = new Account();
    account.amount = 100;
    account.type = TypeRole.EXPENSE;
    account.name = 'IPVA';
    account.sub_account = TypeRole.INTEREST_AND_CHARGES;
    account.number_of_installments = 1;

    let account2 = new Account();
    account2.amount = 50;
    account2.type = TypeRole.EXPENSE;
    account2.name = 'Licenciamento';
    account2.sub_account = TypeRole.INTEREST_AND_CHARGES;
    account2.number_of_installments = 1;

    let budget = new Budget();
    budget.year = 2021;
    budget.accounts = [account, account2];

    const total = getTotalAccount(budget);

    expect(total).toBe(2);
  });

  test('should return quantity of income installments', async () => {
    let account = new Account();
    account.amount = 100;
    account.type = TypeRole.INCOME;
    account.name = 'Salário';
    account.sub_account = TypeRole.WAGE;
    account.number_of_installments = 12;

    let account2 = new Account();
    account2.amount = 50;
    account2.type = TypeRole.INCOME;
    account2.name = '13º';
    account2.sub_account = TypeRole.WAGE;
    account2.number_of_installments = 12;

    let budget = new Budget();
    budget.year = 2021;
    budget.accounts = [account, account2];

    const total = getTotalIncome(budget);

    expect(total).toBe(2);
  });

  test('should return quantity of expense installments', async () => {
    let account = new Account();
    account.amount = 100;
    account.type = TypeRole.EXPENSE;
    account.name = 'IPVA';
    account.sub_account = TypeRole.INTEREST_AND_CHARGES;
    account.number_of_installments = 1;

    let account2 = new Account();
    account2.amount = 50;
    account2.type = TypeRole.EXPENSE;
    account2.name = 'Licenciamento';
    account2.sub_account = TypeRole.INTEREST_AND_CHARGES;
    account2.number_of_installments = 1;

    let budget = new Budget();
    budget.year = 2021;
    budget.accounts = [account, account2];

    const total = getTotalExpanse(budget);

    expect(total).toBe(2);
  });
});
