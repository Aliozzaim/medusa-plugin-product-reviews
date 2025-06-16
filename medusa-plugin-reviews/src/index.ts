import { ProductReview } from "./models/product-review";
import ProductReviewService from "./services/product-review";

const load = async (container, options) => {
  container.register("productReviewService", (container) => {
    return new ProductReviewService({
      manager: container.resolve("manager"),
    });
  });
};

export default {
  load,
  service: ProductReviewService,
  models: [ProductReview],
  repositories: [ProductReviewRepository],
};
