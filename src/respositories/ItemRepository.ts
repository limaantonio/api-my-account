import { EntityRepository, Repository } from 'typeorm';
import { Item } from '../entities/Item';

@EntityRepository(Item)
export default class ItemRepository extends Repository<Item> {}
