import { EntityRepository, Repository } from "typeorm";
import { BudgetMonth } from "../entities/BudgetMonth";

@EntityRepository(BudgetMonth)
export default class BudgetMonthRepository extends Repository<BudgetMonth> {}
