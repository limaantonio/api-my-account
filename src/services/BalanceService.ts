import { TypeRole } from '../entities/Account';
import { Balance } from '../entities/Balance';

function getAmount(balance: Balance, type: string) {
  let value = 0;

  balance.entries.forEach(entry => {
    if (entry.account.type === type) {
      entry.items.forEach(item => {
        value += Number(item.amount);
      });
    }
  });

  return value;
}

function getResult(balance: Balance) {
  let income = 0;
  let expense = 0;

  balance.entries.forEach(entry => {
    if (entry.account.type === TypeRole.INCOME) {
      getAmount(balance, TypeRole.INCOME);
    }
  });

  balance.entries.filter(entry => {
    if (entry.account.type === TypeRole.EXPENSE) {
      getAmount(balance, TypeRole.EXPENSE);
    }
  });

  return income - expense;
}

function getBalance(balance: Balance) {
  const incomes = getAmount(balance, TypeRole.INCOME);
  const expense = getAmount(balance, TypeRole.EXPENSE);
  const result = getResult(balance);

  return {
    incomes,
    expense,
    result,
    balance,
  };
}

export { getAmount, getResult, getBalance };
