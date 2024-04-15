import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entry } from "./Entry";
import { Budget } from "./Budget";

@Entity('budget_month')
export class BudgetMonth {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  budget_id!: string;

  @Column()
  month!: number;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @ManyToOne(() => Budget, budget => budget.budget_months)
  @JoinColumn({ name: 'budget_id' })
  budget: Budget;

  @OneToMany(() => Entry, entry => entry.budget_month, {
    eager: true,
  })
  entries: Entry[];

}