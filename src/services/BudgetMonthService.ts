import { BudgetMonth } from '../entities/BudgetMonth';

function verifyAmountBalance(budgetMonths: BudgetMonth[]) {
  let balance;
  let result = [];
  budgetMonths.forEach(budgetMonth => {
    balance = getAvailableValue(budgetMonth);
    result.push({
      balance,
      budgetMonth,
    });
  });

  return result;
}

function getAvailableValue(budgetMonth: BudgetMonth) {
  let available_value = 0;
  let used_value = 0;

  const values = { available_value, used_value };
  if (budgetMonth.entry.length === 0) {
    available_value = budgetMonth.amount;
    values.available_value = available_value;
  }
  budgetMonth.entry.forEach(entry => {
    let _available_value = budgetMonth.amount;

    if (entry.items.length === 0) {
      available_value = budgetMonth.amount;
      values.available_value = available_value;
    }
    entry.items.forEach(item => {
      values.used_value += Number(item.amount);

      values.available_value = _available_value;
    });
    values.available_value = budgetMonth.amount - values.used_value;
  });
  return values;
}

export { verifyAmountBalance, getAvailableValue };
