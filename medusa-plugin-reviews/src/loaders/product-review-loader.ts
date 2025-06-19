import { MedusaContainer } from "@medusajs/medusa";
import ProductReviewService from "../services/product-review";

export default async function loader({
  container,
}: {
  container: MedusaContainer;
}): Promise<void> {
  console.log("✅ ProductReviewPlugin initializing...");

  // @ts-ignore
  container.register("productReviewService", (container) => {
    return new ProductReviewService({
      manager: container.resolve("manager"),
    });
  });

  const migration = require("../migrations/1685312235425-CreateProductReview");
  const manager = container.resolve("manager");
  await migration.CreateProductReview1685312235425.prototype.up(
    manager.queryRunner
  );
  console.log("✅ ProductReviewPlugin migration executed");
}
