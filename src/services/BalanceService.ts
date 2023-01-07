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
      entry.items.forEach(element => {
        income += Number(element.amount);
      });
    }
  });

  balance.entries.filter(entry => {
    if (entry.account.type === TypeRole.EXPENSE) {
      entry.items.forEach(element => {
        expense += Number(element.amount);
      });
    }
  });

  return income - expense;
}

export { getAmount, getResult };
