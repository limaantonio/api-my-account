import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Account } from './Account';

@Entity('budget')
class Budget {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  year!: number;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToMany(() => Account, account => account.budget, {
    eager: true,
  })
  accounts: Account[];
}

export { Budget };
