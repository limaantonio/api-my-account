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

@Entity('entry')
class Entry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  description!: string;

  @Column()
  installment!: number;

  @Column()
  balance_id!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => Balance, balance => balance.entries)
  @JoinColumn({ name: 'balance_id' })
  balance: Balance;

  @OneToMany(() => Item, item => item.entry, {
    eager: true,
  })
  items: Item[];

  @ManyToOne(() => Account, account => account.entry, {
    lazy: true,
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;
}

export { Entry };
