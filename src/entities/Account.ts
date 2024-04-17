import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  import { Budget } from './Budget';
  import { Entry } from './Entry';
  
  export enum TypeRole {
    WAGE = 'salário',
    WAGE_BONUS = 'salário bônus',
    WAGE_EXTRA = 'salário extra',
    WAGE_OTHER = 'salário outros',
    RETIREMENT = 'aposentadoria',
    FAMILY_FUND = 'fundos familiares',
    INVESTIMENT = 'investimento',
    ECONOMY = 'economia',
    INVESTIMENT_OTHER = 'investimento outros',
    CURRENT_EXPENSES = 'despesas correntes',
    OLD_EXPENSES = 'despesas antigas',
    CURRENT_EXPENSES_OTHER = 'despesas correntes outros',
    TAX_FESS = 'taxas e impostos',
    OTHER = 'outros',
  }
  
  export enum TypeRole {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
  }
  
  @Entity('account')
  class Account {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column()
    name!: string;
  
    @Column()
    amount!: number;
  
    @Column({
      type: 'enum',
      enum: TypeRole,
      default: TypeRole.OTHER,
    })
    sub_account: TypeRole;
  
    @Column({
      type: 'enum',
      enum: TypeRole,
      default: TypeRole.EXPENSE,
    })
    type: TypeRole;
  
    @Column()
    number_of_installments!: number;
  
    @Column()
    budget_id!: string;
  
    @Column()
    created_at!: Date;
  
    @Column()
    updated_at!: Date;
  
    @ManyToOne(() => Budget, budget => budget.accounts)
    @JoinColumn({ name: 'budget_id' })
    budget: Budget;

    @OneToMany(() => Entry, entry => entry.account)
    entry: Entry[];
  
  }
  
  export { Account };