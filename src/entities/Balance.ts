import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('balance')
class Balance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  month!: number;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;
}

export { Balance };
