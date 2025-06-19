import ProductReviewService from "../services/product-review";
import { AwilixContainer } from "awilix";
import { CreateProductReview1685312235425 } from "../migrations/1685312235425-CreateProductReview";

export default async function loader({
  container,
}: {
  container: AwilixContainer;
}): Promise<void> {
  console.log("✅ ProductReviewPlugin initializing...");

  // @ts-ignore
  container.register("productReviewService", (container) => {
    return new ProductReviewService({
      manager: container.resolve("manager"),
    });
  });

  const manager = container.resolve("manager");
  await CreateProductReview1685312235425.prototype.up(manager.queryRunner);

  console.log("✅ ProductReviewPlugin migration executed");
}
