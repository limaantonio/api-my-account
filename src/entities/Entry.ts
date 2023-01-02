import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Account } from './Account';
import { Balance } from './Balance';
import { Item } from './Item';

export enum TypeRole {
  WAGE = 'salário',
  WAGE_BONUS = 'salário bônus',
  WAGE_EXTRA = 'salário extra',
  WAGE_OTHER = 'salário outros',
  RETIREMENT = 'aposentadoria',
  FAMILY_FUND = 'fundos familiares',
  INVESTIMENT = 'investimento',
  INVESTIMENT_OTHER = 'investimento outros',
  CURRENT_EXPENSES = 'despesas correntes',
  CURRENT_EXPENSES_OTHER = 'despesas correntes outros',
  INTEREST_AND_CHARGES = 'juros e encargos',
  OTHER = 'outros',
}

export enum TypeRole {
  INCOME = 'receita',
  EXPENSE = 'despesa',
}

@Entity('entry')
class Entry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  description!: string;

  @Column()
  amount!: number;

  @Column({
    type: 'enum',
    enum: TypeRole,
    default: TypeRole.OTHER,
  })
  sub_account: TypeRole;

  @Column({
    type: 'enum',
    enum: TypeRole,
    default: TypeRole.EXPENSE,
  })
  type: TypeRole;

  @Column()
  number_of_installments!: number;

  @Column()
  installment!: number;

  @Column()
  budget_id!: string;

  @Column()
  balance_id!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => Balance, balance => balance.entry, {
    eager: true,
  })
  @JoinColumn({ name: 'balance_id' })
  balance: Balance;

  @OneToOne(() => Account, account => account.entry, {
    eager: true,
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @OneToMany(() => Item, item => item.entry)
  item: Item;
}

export { Entry };
