import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableAccount1713099397836 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
            name: 'account',
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
                    name: 'sub_account',
                    type: 'enum',
                    enum: [
                        'WAGE',
                        'WAGE_BONUS',
                        'WAGE_EXTRA',
                        'WAGE_OTHER',
                        'RETIREMENT',
                        'FAMILY_FUND',
                        'INVESTIMENT',
                        'ECONOMY',
                        'INVESTIMENT_OTHER',
                        'CURRENT_EXPENSES',
                        'OLD_EXPENSES',
                        'CURRENT_EXPENSES_OTHER',
                        'INTEREST_AND_CHARGES',
                        'TAX_FESS',
                        'OTHER',
                    ],
                },
                { name: 'type', type: 'enum', enum: ['INCOME', 'EXPENSE'] },
                {
                    name: 'amount',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                },
                {
                    name: 'number_of_installments',
                    type: 'integer',
                    isNullable: true,
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
        await queryRunner.dropTable('account');
    }
}