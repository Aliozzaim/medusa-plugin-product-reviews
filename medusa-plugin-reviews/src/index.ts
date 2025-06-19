import loader from "./loaders/product-review-loader";
import ProductReviewService from "./services/product-review";
import { ProductReview } from "./models/product-review";
import ProductReviewsPage from "./admin/routes/reviews/page";

export default loader;
export { ProductReviewService, ProductReview, ProductReviewsPage };
