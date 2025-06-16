import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { Product, ProductVariant } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity()
export class ProductReview extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  product_id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ nullable: true })
  variant_id: string;

  @ManyToOne(() => ProductVariant, { onDelete: "SET NULL" })
  @JoinColumn({ name: "variant_id" })
  variant: ProductVariant;

  @Column({ type: "int" })
  rating: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ default: false })
  approved: boolean;

  @Column({ nullable: true })
  customer_email: string;

  @Column({ nullable: true })
  customer_name: string;

  @Column({ nullable: true })
  customer_id: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "prrev");
  }
}
