import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('bugdet')
class Bugdet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  year!: number;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;
}

export { Bugdet };
