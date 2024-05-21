import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from './Account';
import { BudgetMonth } from './BudgetMonth';
import { User } from './User';
import { SubAccount } from './SubAccount';

@Entity('budget')
class Budget {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  year!: number;

  @Column()
  flag_income_registred!: boolean;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToMany(() => SubAccount, subAccount => subAccount.budget, {
    eager: true,
  })
  sub_accounts: SubAccount[];

  @OneToMany(() => BudgetMonth, budgetMonth => budgetMonth.budget)
  budget_months: BudgetMonth[];

  @ManyToOne(() => User, user => user.budget)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Account, account => account.budget)
  accounts: Account[];
}

export { Budget };
