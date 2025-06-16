import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductReview1685312235425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "product_review",
        columns: [
          { name: "id", type: "varchar", isPrimary: true },
          { name: "product_id", type: "varchar" },
          { name: "variant_id", type: "varchar", isNullable: true },
          { name: "rating", type: "int" },
          { name: "title", type: "varchar" },
          { name: "content", type: "text" },
          { name: "approved", type: "boolean", default: false },
          { name: "customer_id", type: "varchar", isNullable: true },
          { name: "customer_email", type: "varchar", isNullable: true },
          { name: "customer_name", type: "varchar", isNullable: true },
          {
            name: "created_at",
            type: "timestamp with time zone",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp with time zone",
            default: "now()",
          },
          {
            name: "deleted_at",
            type: "timestamp with time zone",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["product_id"],
            referencedTableName: "product",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
          {
            columnNames: ["variant_id"],
            referencedTableName: "product_variant",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("product_review");
  }
}
