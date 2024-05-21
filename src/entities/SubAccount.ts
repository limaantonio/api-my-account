// SubAccount.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from './Account';
import { Budget } from './Budget';

export enum TypeRole {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

@Entity('sub_account')
class SubAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  percentage!: number;

  @Column({
    type: 'enum',
    enum: TypeRole,
    default: TypeRole.EXPENSE,
  })
  type: TypeRole;

  @Column()
  amount!: number;

  @Column()
  principal!: boolean;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToMany(() => Account, account => account.sub_account)
  accounts: Account[];

  @ManyToOne(() => Budget, budget => budget.sub_accounts)
  @JoinColumn({ name: 'budget_id' })
  budget: Budget;
}

export { SubAccount };
