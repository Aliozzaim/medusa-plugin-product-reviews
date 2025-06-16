import ProductReviewService from "../services/product-review";

export default async ({ container }) => {
  container.register("productReviewService", (container) => {
    return new ProductReviewService({
      manager: container.resolve("manager"),
    });
  });
};
