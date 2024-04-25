import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Budget } from './Budget';
import { Entry } from './Entry';
import { SubAccount } from './SubAccount';

@Entity('account')
class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  number_of_installments!: number;

  @Column()
  amount!: number;

  @Column()
  budget_id!: string;

  @Column()
  sub_account_id!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => Budget, budget => budget.accounts)
  @JoinColumn({ name: 'budget_id' })
  budget: Budget;

  @ManyToOne(() => SubAccount, subAccount => subAccount.accounts, {
    eager: true,
  })
  @JoinColumn({ name: 'sub_account_id' })
  sub_account: SubAccount;

  @OneToMany(() => Entry, entry => entry.account)
  entry: Entry;
}

export { Account };
