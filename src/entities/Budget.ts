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

  @OneToMany(() => Account, account => account.budget, {
    eager: true,
  })
  accounts: Account[];

  @OneToMany(() => BudgetMonth, budgetMonth => budgetMonth.budget, {
    eager: true,
  })
  budget_months: BudgetMonth[];

  @ManyToOne(() => User, user => user.budget)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

export { Budget };
