import { Account } from '../../entities/Account';
import { TypeRole } from '../../entities/Account';
import { Balance } from '../../entities/Balance';
import { Budget } from '../../entities/Budget';
import { Entry } from '../../entities/Entry';
import { Item } from '../../entities/Item';
import { verifyAmountBalance } from '../../services/EntryService';

describe('shold be test entry service', () => {
  it('should be to register entry', async () => {
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

    const result = verifyAmountBalance(account, entry);
    expect(result).toBe('Amount is greater than account amount');
  });
});
