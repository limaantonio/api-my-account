import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableSubAccount1715632762115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sub_account',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'percentage',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          { name: 'type', type: 'enum', enum: ['INCOME', 'EXPENSE'] },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'installments',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'principal',
            type: 'boolean',
            default: false,
          },
          {
            name: 'budget_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FKBudget',
            referencedTableName: 'budget',
            referencedColumnNames: ['id'],
            columnNames: ['budget_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sub_account');
  }
}
