import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateTableEntry1713099511267 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'entry',
            columns: [
              {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()',
              },
              {
                name: 'description',
                type: 'varchar',
                isNullable: true,
              },
              {
                name: 'installment',
                type: 'integer',
                isNullable: true,
              },
              {
                name: 'status',
                type: 'enum',
                enum: ['CLOSED', 'IN_PROGRESS', 'PENDING'],
                default: "'PENDING'",
              },
              {
                name: 'budget_month_id',
                type: 'uuid',
              },
              {
                name : 'account_id',
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
                name: 'FKBudgetMonth',
                referencedTableName: 'budget_month',
                referencedColumnNames: ['id'],
                columnNames: ['budget_month_id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
              },
              {
                name: 'FKAccount',
                referencedTableName: 'account',
                referencedColumnNames: ['id'],
                columnNames: ['account_id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
              },
            ],
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('entry');
      }
    }
    
