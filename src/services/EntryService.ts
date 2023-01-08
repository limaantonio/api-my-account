import { Account } from '../entities/Account';
import { Entry } from '../entities/Entry';

interface IResquestEntry {
  amount: number;
  entry: Entry;
}

function verifyAmountBalance(account: Account, entry: Entry) {
  let availableValue;
  let amountUsed = 0;

  account.entry.forEach(entry => {
    entry.items.forEach(item => {
      amountUsed += Number(item.amount);
    });
  });

  return;
}

export { verifyAmountBalance };
