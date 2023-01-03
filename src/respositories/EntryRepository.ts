import { EntityRepository, Repository } from 'typeorm';
import { Entry } from '../entities/Entry';

@EntityRepository(Entry)
export default class EntryRepository extends Repository<Entry> {}
