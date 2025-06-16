import { TransactionBaseService } from "@medusajs/medusa";
import { ProductReview } from "../models/product-review";
import { EntityManager, Repository } from "typeorm";

class ProductReviewService extends TransactionBaseService {
  protected manager_: EntityManager;
  protected readonly productReviewRepo_: Repository<ProductReview>;

  constructor({ manager }) {
    super(arguments[0]);
    this.manager_ = manager;
    this.productReviewRepo_ = manager.getRepository(ProductReview);
  }

  async create(data: Partial<ProductReview>) {
    try {
      const review = this.productReviewRepo_.create(data);
      const savedReview = await this.productReviewRepo_.save(review);
      return this.productReviewRepo_.findOne({
        where: { id: savedReview.id },
        relations: ["product", "variant"],
      });
    } catch (err) {
      throw new Error(`Failed to create review: ${err.message}`);
    }
  }

  async approve(reviewId: string) {
    return this.productReviewRepo_.update(reviewId, { approved: true });
  }

  async reject(reviewId: string) {
    return this.productReviewRepo_.update(reviewId, { approved: false });
  }

  async delete(reviewId: string) {
    return this.productReviewRepo_.delete(reviewId);
  }

  async listAll(
    options?: { skip?: number; take?: number },
    sort?: { field: string; order: "ASC" | "DESC" }
  ) {
    const allowedSortFields = ["created_at", "updated_at", "rating", "title"];

    const order: Record<string, "ASC" | "DESC"> =
      sort && allowedSortFields.includes(sort.field)
        ? { [sort.field]: sort.order }
        : {};

    const [reviews, count] = await this.productReviewRepo_.findAndCount({
      relations: ["product", "variant"],
      skip: options?.skip,
      take: options?.take,
      order,
    });

    return { reviews, count };
  }

  async listByApproval(
    isApproved: boolean,
    options?: { skip?: number; take?: number },
    sort?: { field: string; order: "ASC" | "DESC" }
  ) {
    const allowedSortFields = ["created_at", "updated_at", "rating", "title"];

    const order: Record<string, "ASC" | "DESC"> =
      sort && allowedSortFields.includes(sort.field)
        ? { [sort.field]: sort.order }
        : {};

    const [reviews, count] = await this.productReviewRepo_.findAndCount({
      where: { approved: isApproved },
      relations: ["product", "variant"],
      skip: options?.skip,
      take: options?.take,
      order,
    });

    return { reviews, count };
  }

  async findById(reviewId: string) {
    return this.productReviewRepo_.findOne({
      where: { id: reviewId },
      relations: ["product", "variant"],
    });
  }

  async findByProductOrVariant(
    productId?: string,
    variantId?: string,
    options?: { skip?: number; take?: number },
    sort?: { field: string; order: "ASC" | "DESC" }
  ): Promise<{ reviews: ProductReview[]; count: number }> {
    const allowedSortFields = ["created_at", "updated_at", "rating", "title"];

    const order: Record<string, "ASC" | "DESC"> =
      sort && allowedSortFields.includes(sort.field)
        ? { [sort.field]: sort.order }
        : { created_at: "DESC" };

    if (!productId && !variantId) {
      return { reviews: [], count: 0 };
    }

    const where: Record<string, any> = {
      approved: true,
    };

    if (productId) {
      where.product_id = productId;
    }

    if (variantId) {
      where.variant_id = variantId;
    }

    const [reviews, count] = await this.productReviewRepo_.findAndCount({
      where,
      relations: ["product", "variant"],
      skip: options?.skip,
      take: options?.take,
      order,
    });

    return { reviews, count };
  }
}

export default ProductReviewService;
