import { EntityRepository, Repository } from 'typeorm';
import { SubAccount } from '../entities/SubAccount';

@EntityRepository(SubAccount)
export default class SubAccountRepository extends Repository<SubAccount> {}
