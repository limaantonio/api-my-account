import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Entry } from './Entry';

@Entity('item')
class Item {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  qtde!: Number;

  @Column()
  amount!: Number;

  @Column()
  account_id!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => Entry, entry => entry.item, {
    eager: true,
  })
  @JoinColumn({ name: 'entry_id' })
  entry: Entry;
}

export { Item };
