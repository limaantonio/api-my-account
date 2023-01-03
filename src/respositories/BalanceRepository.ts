import { EntityRepository, Repository } from 'typeorm';
import { Balance } from '../entities/Balance';

@EntityRepository(Balance)
export default class BalanceRepository extends Repository<Balance> {}
