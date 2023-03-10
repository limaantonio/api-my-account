import { Account, TypeRole } from '../entities/Account';
import { Budget } from '../entities/Budget';

function getTotalAmountIncome(budget: Budget): Number {
  let total = 0;
  budget.accounts.forEach(account => {
    if (account.type === 'INCOME') {
      total += Number(account.amount);
    }
  });
  return total;
}

function getTotalAmountExpense(budget: Budget): Number {
  let total = 0;
  budget.accounts.forEach(account => {
    if (account.type === 'EXPENSE') {
      total += Number(account.amount);
    }
  });
  return total;
}

function getSummary(budget: Budget): number {
  if (budget.accounts.length === 0) {
    return 0;
  }
  return (
    Number(getTotalAmountIncome(budget)) - Number(getTotalAmountExpense(budget))
  );
}

function getTotalIncome(budget: Budget) {
  let total = 0;
  budget.accounts.forEach(account => {
    if (account.type === 'INCOME') {
      total++;
    }
  });
  return total;
}

function getTotalExpanse(budget: Budget) {
  let total = 0;
  budget.accounts.forEach(account => {
    if (account.type === 'EXPENSE') {
      total++;
    }
  });
  return total;
}

function getTotalAccount(budget: Budget): number {
  return Number(budget.accounts.length);
}

function getBudgetByType(budget: Budget, type: TypeRole): Account[] {
  return budget.accounts.filter(account => account.type === type);
}

function getBudget(budget: Budget) {
  let totalAmount;
  let _budget;
  let incomeAmount;
  let expenseAmount;
  let totalAccount;
  let totalIncome;
  let totalExpense;

  incomeAmount = getTotalAmountIncome(budget);
  expenseAmount = getTotalAmountExpense(budget);
  totalAmount = getSummary(budget);
  totalAccount = getTotalAccount(budget);
  totalIncome = getTotalIncome(budget);
  totalExpense = getTotalExpanse(budget);

  _budget = {
    totalAccount,
    totalIncome,
    totalExpense,
    incomeAmount,
    expenseAmount,
    totalAmount,
    budget,
  };

  return _budget;
}

export {
  getTotalAmountIncome,
  getTotalAmountExpense,
  getSummary,
  getTotalAccount,
  getTotalExpanse,
  getTotalIncome,
  getBudget,
};
