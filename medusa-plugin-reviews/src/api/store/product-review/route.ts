import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const productReviewService = req.scope.resolve("productReviewService");

    const {
      productId,
      variantId,
      limit = "10",
      offset = "0",
      field = "created_at",
      order = "DESC",
    } = req.query;

    const parsedLimit = parseInt(limit as string, 10);
    const parsedOffset = parseInt(offset as string, 10);

    if (!productId && !variantId) {
      return res.status(400).json({
        message: "Either 'productId' or 'variantId' must be provided.",
      });
    }

    const allowedSortFields = ["created_at", "updated_at", "rating", "title"];
    const sortField = allowedSortFields.includes(field as string)
      ? (field as string)
      : "created_at";
    const sortOrder = (
      String(order).toUpperCase() === "ASC" ? "ASC" : "DESC"
    ) as "ASC" | "DESC";

    const reviews = await productReviewService.findByProductOrVariant(
      productId as string,
      variantId as string,
      { skip: parsedOffset, take: parsedLimit },
      { field: sortField, order: sortOrder }
    );

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        message: "No reviews found for the given product or variant.",
      });
    }

    res.status(200).json({
      reviews,
      count: reviews.length,
      limit: parsedLimit,
      offset: parsedOffset,
      sortOrder,
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const productReviewService = req.scope.resolve("productReviewService");

    const {
      product_id,
      variant_id,
      rating,
      title,
      content,
      customer_id,
      customer_name,
      customer_email,
    } = req.body as {
      product_id: string;
      variant_id: string;
      rating: number;
      title: string;
      content: string;
      customer_id?: string;
      customer_name?: string;
      customer_email?: string;
    };

    const missingFields: string[] = [];

    if (!product_id) missingFields.push("product_id");
    if (!variant_id) missingFields.push("variant_id");
    if (rating === undefined || rating === null) missingFields.push("rating");
    if (!title) missingFields.push("title");
    if (!content) missingFields.push("content");
    if (!customer_email) missingFields.push("customer_email");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required field(s).",
        missing: missingFields,
      });
    }

    const review = await productReviewService.create({
      product_id,
      variant_id,
      rating,
      title,
      content,
      customer_id,
      customer_name,
      customer_email,
      approved: false,
    });

    res.status(200).json({ review });
  } catch (error) {
    console.error("Failed to create product review:", error);
    res.status(500).json({
      error: "An unexpected error occurred while creating the product review.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
