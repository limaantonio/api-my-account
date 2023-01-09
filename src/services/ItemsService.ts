import { Entry } from '../entities/Entry';

function getItemsAmount(entry: Entry) {
  let amount = 0;
  entry.items.forEach(item => {
    amount += Number(item.amount);
  });
  return amount;
}

export { getItemsAmount };
