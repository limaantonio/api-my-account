import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Budget } from './Budget';
import { Entry } from './Entry';

@Entity('balance')
class Balance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  month!: number;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => Budget, bugdet => bugdet.balance, {
    eager: true,
  })
  @JoinColumn({ name: 'budget_id' })
  buget: Budget;

  @OneToMany(() => Entry, entry => entry.balance)
  entry: Entry;
}

export { Balance };
