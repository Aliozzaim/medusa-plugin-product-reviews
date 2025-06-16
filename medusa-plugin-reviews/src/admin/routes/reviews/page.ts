import { RouteConfig } from "@medusajs/admin";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { Table, Button, Badge, Toaster, toast, Select } from "@medusajs/ui";
import { ChatBubbleLeftRightSolid, Spinner } from "@medusajs/icons";
import { getTranslationMetadata } from "../../utils/get-translation";
import { useState } from "react";

const PAGE_SIZE = 5;

const ProductReviewsPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [minRatingFilter, setMinRatingFilter] = useState("all");
  const [pageIndex, setPageIndex] = useState(0);

  const queryKey = [
    "product-review",
    statusFilter,
    minRatingFilter,
    pageIndex,
    PAGE_SIZE,
  ];

  const queryParams = new URLSearchParams();

  if (statusFilter !== "all") {
    if (statusFilter === "approved") queryParams.set("status", "approved");
    else if (statusFilter === "pending") queryParams.set("status", "pending");
    else if (statusFilter === "reject") queryParams.set("status", "reject");
  }

  queryParams.set("limit", PAGE_SIZE.toString());
  queryParams.set("offset", (pageIndex * PAGE_SIZE).toString());

  const { data, isLoading, refetch } = useAdminCustomQuery(
    `/product-review?${queryParams.toString()}`,
    queryKey,
    {
      keepPreviousData: true,
    }
  );

  const { mutate: updateReview } = useAdminCustomPost("/product-review", [
    "product-review",
  ]);

  const filteredReviews = (data?.reviews || []).filter((review) => {
    if (minRatingFilter === "all") return true;
    return review.rating >= parseInt(minRatingFilter);
  });

  const totalCount = data?.count ?? 0;
  const pageCount = Math.ceil(totalCount / PAGE_SIZE);

  const handleReviewAction = (
    id: string,
    action: "approve" | "reject" | "delete"
  ) => {
    updateReview(
      { id, action },
      {
        onSuccess: () => {
          refetch();
          toast.success("Success", {
            description: `Review ${action}d successfully ID: ${id}`,
            duration: 3000,
          });
        },
        onError: (err) => {
          console.error(`Review ${action} failed:`, err);
          toast.error("Error", {
            description: `Failed to ${action} review ID: ${id}: ${err.message}`,
            duration: 3000,
          });
        },
      }
    );
  };

  return (
    <div className="p-8 shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg overflow-hidden">
      <h1 className="text-xl font-bold mb-4">Product Reviews</h1>

      <div className="flex gap-4 mb-6 items-end justify-end">
        <div>
          <label className="block text-sm font-medium mb-1 w-29">Status</label>
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPageIndex(0);
            }}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All</Select.Item>
              <Select.Item value="approved">Approved</Select.Item>
              <Select.Item value="pending">Pending</Select.Item>
            </Select.Content>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 w-29">
            Minimum Rating
          </label>
          <Select
            value={minRatingFilter}
            onValueChange={(val) => {
              setMinRatingFilter(val);
              setPageIndex(0);
            }}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All</Select.Item>
              {[1, 2, 3, 4, 5].map((r) => (
                <Select.Item key={r} value={r.toString()}>
                  {r}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell>Variant</Table.HeaderCell>
            <Table.HeaderCell>Rating</Table.HeaderCell>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Content</Table.HeaderCell>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredReviews.length ? (
            filteredReviews.map((review) => {
              const isApproved = review.approved;
              const toggleAction = isApproved ? "reject" : "approve";
              const actionLabel = isApproved ? "Reject" : "Approve";
              const actionVariant = isApproved ? "primary" : "secondary";

              return (
                <Table.Row key={review.id} className="hover:bg-gray-100 !h-20">
                  <Table.Cell className="truncate max-w-[300px]">
                    <a
                      href={`/a/products/${review.product_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {review.product.title || review.product.id}
                    </a>
                  </Table.Cell>
                  <Table.Cell>
                    {review.variant.title || review.variant.id}
                  </Table.Cell>
                  <Table.Cell>{review.rating}</Table.Cell>

                  <Table.Cell className="truncate max-w-[300px]">
                    {review.title}
                  </Table.Cell>
                  <Table.Cell className="max-w-[300px]">
                    <div className=" whitespace-pre-wrap break-words">
                      {review.content}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {review.customer_email || review.customer_name}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={isApproved ? "green" : "blue"}>
                      {isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-2">
                      <Button
                        className="!w-18"
                        variant={actionVariant}
                        size="small"
                        onClick={() =>
                          handleReviewAction(review.id, toggleAction)
                        }
                      >
                        {actionLabel}
                      </Button>
                      <Button
                        className="!w-18"
                        variant="danger"
                        size="small"
                        onClick={() => handleReviewAction(review.id, "delete")}
                      >
                        Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              <td colSpan={8} className="!h-96">
                <div className="flex justify-center items-center h-full">
                  <Spinner className="animate-spin" />
                </div>
              </td>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      <div className="flex justify-end mt-4">
        <Table.Pagination
          count={totalCount}
          pageSize={PAGE_SIZE}
          pageIndex={pageIndex}
          pageCount={pageCount}
          canPreviousPage={pageIndex > 0}
          canNextPage={pageIndex < pageCount - 1}
          previousPage={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
          nextPage={() =>
            setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))
          }
        />
      </div>

      <Toaster />
    </div>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Reviews",
    icon: ChatBubbleLeftRightSolid,
  },
};

export default ProductReviewsPage;
