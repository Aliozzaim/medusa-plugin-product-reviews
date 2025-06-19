import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const productReviewService = req.scope.resolve("productReviewService");

    const {
      status,
      limit = "10",
      offset = "0",
      field = "created_at",
      order = "DESC",
    } = req.query;

    const parsedLimit = parseInt(limit as string, 10);
    const parsedOffset = parseInt(offset as string, 10);

    const allowedSortFields = ["created_at", "updated_at", "rating", "title"];
    const normalizedOrder =
      String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";
    const sortField = allowedSortFields.includes(field as string)
      ? (field as string)
      : "created_at";

    const options = {
      skip: parsedOffset,
      take: parsedLimit,
    };

    const sort = {
      field: sortField,
      order: normalizedOrder as "ASC" | "DESC",
    };

    let reviews, count;

    switch (status) {
      case "pending":
        ({ reviews, count } = await productReviewService.listByApproval(
          false,
          options,
          sort
        ));
        break;
      case "approved":
        ({ reviews, count } = await productReviewService.listByApproval(
          true,
          options,
          sort
        ));
        break;
      default:
        ({ reviews, count } = await productReviewService.listAll(
          options,
          sort
        ));
        break;
    }

    res.status(200).json({
      reviews,
      count,
      limit: parsedLimit,
      offset: parsedOffset,
      sortField,
      sortOrder: normalizedOrder,
    });
  } catch (error) {
    console.error("Failed to fetch product reviews:", error);
    res.status(500).json({
      error: "An unexpected error occurred while retrieving product reviews.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const POST = async (
  req: MedusaRequest & {
    body: {
      id: string;
      action: "approve" | "reject" | "delete";
    };
  },
  res: MedusaResponse
) => {
  const productReviewService = req.scope.resolve("productReviewService");
  const { id, action } = req.body;

  if (!id || !action) {
    return res.status(400).json({ message: "Missing id or action" });
  }

  try {
    switch (action) {
      case "approve":
        await productReviewService.approve(id);
        return res.status(200).json({ message: "Review approved" });

      case "reject":
        await productReviewService.reject(id);
        return res.status(200).json({ message: "Review rejected" });

      case "delete":
        await productReviewService.delete(id);
        return res.status(200).json({ message: "Review deleted" });

      default:
        return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};
