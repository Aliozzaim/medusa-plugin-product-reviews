import ProductReviewService from "../services/product-review";
import { MedusaContainer } from "@medusajs/medusa";
export default async ({ container }: { container: MedusaContainer }) => {
  // @ts-ignore
  container.register("productReviewService", (container: MedusaContainer) => {
    return new ProductReviewService({
      manager: container.resolve("manager"),
    });
  });
};
