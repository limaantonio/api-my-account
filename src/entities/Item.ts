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
  entry_id!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => Entry, entry => entry.items)
  @JoinColumn({ name: 'entry_id' })
  entry: Entry;
}

export { Item };
