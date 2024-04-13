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
import { Item } from './Item';

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
  month!: number;

  @Column()
  status!: TypeRole.PENDING;

  @Column()
  account_id!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

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
