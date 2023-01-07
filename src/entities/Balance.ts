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

export enum TypeRole {
  CLOSED = 'closed',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
}

@Entity('balance')
class Balance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  month!: number;

  @Column({
    type: 'enum',
    enum: TypeRole,
    default: TypeRole.PENDING,
  })
  status!: TypeRole;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => Budget, bugdet => bugdet.balance)
  @JoinColumn({ name: 'budget_id' })
  budget: Budget;

  @OneToMany(() => Entry, entry => entry.balance, {
    eager: true,
  })
  entries: Entry[];
}

export { Balance };
