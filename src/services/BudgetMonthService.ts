import { BudgetMonth } from '../entities/BudgetMonth';

function getTotalAmountIncome(budget: BudgetMonth): Number {
  let total = 0;
  budget.entry.forEach(entry => {
    if (entry.account?.sub_account.type === 'INCOME') {
      entry.items.map(item => {
        total += Number(item.amount);
      });
    }
  });
  return total;
}

function getTotalAmountExpense(budget: BudgetMonth): Number {
  let total = 0;

  budget?.entry.forEach(entry => {
    if (entry?.account?.sub_account?.type === 'EXPENSE') {
      entry.items.map(item => {
        total += Number(item.amount);
      });
    }
  });
  return total;
}

function getSummary(budget: BudgetMonth): number {
  if (budget.entry.length === 0) {
    return 0;
  }
  return (
    Number(getTotalAmountIncome(budget)) - Number(getTotalAmountExpense(budget))
  );
}

function getTotalIncome(budget: BudgetMonth) {
  let total = 0;
  budget.entry.forEach(entry => {
    if (entry.account.sub_account.type === 'INCOME') {
      total++;
    }
  });
  return total;
}

function getTotalExpanse(budget: BudgetMonth) {
  let total = 0;
  budget.entry.forEach(entry => {
    if (entry.account.sub_account.type === 'EXPENSE') {
      total++;
    }
  });
  return total;
}

function getTotalAccount(budget: BudgetMonth): number {
  return Number(budget.entry.length);
}

function getBudget(budgetMonth: BudgetMonth) {
  let totalAmount;
  let _budget;
  let incomeAmount;
  let expenseAmount;
  let totalAccount;
  let totalIncome;
  let totalExpense;

  incomeAmount = getTotalAmountIncome(budgetMonth);
  expenseAmount = getTotalAmountExpense(budgetMonth);
  totalAmount = getSummary(budgetMonth);
  totalAccount = getTotalAccount(budgetMonth);
  totalIncome = getTotalIncome(budgetMonth);
  totalExpense = getTotalExpanse(budgetMonth);

  _budget = {
    totalAccount,
    totalIncome,
    totalExpense,
    incomeAmount,
    expenseAmount,
    totalAmount,
    budgetMonth, //se quiser mostrar o balanco do mes completo
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
