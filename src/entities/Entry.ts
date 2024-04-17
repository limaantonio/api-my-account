import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Item } from './Item';
import { BudgetMonth } from './BudgetMonth';
import { Account } from './Account';

export enum TypeRole {
  PENDING = 'PENDING',
  CLOSED = 'CLOSED',
  IN_PROGRESS = 'IN_PROGRESS',
}

@Entity('entry')
class Entry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  description!: string;

  @Column()
  installment!: number;

  @Column()
  status!: TypeRole.PENDING;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToMany(() => Item, item => item.entry, {
    eager: true,
  })
  items: Item[];

  @ManyToOne(() => BudgetMonth, budget_month => budget_month.entries)
  @JoinColumn({ name: 'budget_month_id' })
  budget_month: BudgetMonth;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;
}

export { Entry };
