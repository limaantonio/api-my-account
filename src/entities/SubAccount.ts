import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Account } from './Account';

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
}

export { SubAccount };
