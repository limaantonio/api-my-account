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
  amount!: number;

  @Column()
  number_of_installments!: number;

  @Column()
  installment!: number;

  @Column()
  balance_id!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => Balance, balance => balance.entry)
  @JoinColumn({ name: 'balance_id' })
  balance: Balance;

  @OneToOne(() => Account, account => account.entry, {
    eager: true,
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @OneToMany(() => Item, item => item.entry, {
    eager: true,
  })
  item: Item;
}

export { Entry };
