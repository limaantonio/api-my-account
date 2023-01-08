import { Account } from '../entities/Account';

function verifyAmountBalance(accounts: Account[]) {
  let balance;
  let result;
  accounts.forEach(account => {
    balance = getAvailableValue(account);
    result = {
      balance,
      accounts,
    };
  });

  return result;
}

function getAvailableValue(account: Account) {
  let available_value = 0;
  let used_value = 0;

  const values = { available_value, used_value };
  if (account.entry.length === 0) {
    available_value = account.amount;
    values.available_value = available_value;
  }
  account.entry.forEach(entry => {
    let _available_value = account.amount;

    if (entry.items.length === 0) {
      available_value = account.amount;
      values.available_value = available_value;
    }
    entry.items.forEach(item => {
      values.used_value += Number(item.amount);
      _available_value -= Number(item.amount);
      values.available_value = _available_value;
    });
  });
  return values;
}

export { verifyAmountBalance, getAvailableValue };
