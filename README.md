# Medusa Product Review Plugin

A plugin for [Medusa](https://medusajs.com/) that enables product reviews in your e-commerce store

## Features

- Customers can leave reviews on products
- Admins can moderate, approve, or delete reviews
- Ratings and comments support
- Aggregate product ratings
- Fully customizable through the Medusa admin panel

## Installation

### Install the Plugin

```bash
npm install medusa-plugin-reviews
```

### Add the Plugin to Your `medusa-config.js`

```js
const plugins = [
  // ...other plugins
  {
    resolve: "medusa-plugin-reviews",
    options: {},
  },
];
```

## Usage

### Customers

Customers can submit reviews via the storefront or API.

### Admins

Admins can manage reviews in the Medusa admin dashboard.

## API Endpoints

### `POST /store/reviews`

Submit a review.

#### Request Body:

```json
{
  "product_id": "prod_123",
  "variant_id": "variant_123",
  "rating": 4,
  "comment": "Good quality",
  "name": "Ali"
}
```

#### Responses:

**200 OK**

```json
{
  "review": {
    "id": "rev_456",
    "product_id": "prod_123",
    "rating": 4,
    "comment": "Good quality",
    "name": "Ali",
    "approved": false,
    "created_at": "2025-06-16T12:30:00.000Z"
  }
}
```

**400 Bad Request**

```json
{
  "message": "Missing required fields"
}
```

### `GET /store/products/:id/reviews`

Retrieve reviews for a specific product.

#### Query Parameters:

- `product_id` (string, optional): Filter reviews by Product ID.
- `variant_id` (string, optional): Filter reviews by Variant ID.

#### Responses:

**200 OK**

```json
{
  "reviews": [
    {
      "id": "rev_123",
      "product_id": "prod_123",
      "variant_id": "variant_123",
      "rating": 5,
      "comment": "Awesome product!",
      "name": "Ali",
      "approved": true,
      "created_at": "2025-06-16T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

**404 Not Found**

```json
{
  "message": "No reviews found for the provided criteria"
}
```

**500 Internal Server Error**

```json
{
  "message": "An error occurred while fetching reviews"
}
```

### Admin API

#### `GET /admin/reviews`

Get all reviews, optionally filtered by product or approval status.

##### Query Parameters:

- `product_id` (string, optional)
- `variant_id` (string, optional)
- `approved` (boolean, optional)

#### Responses:

**200 OK**

```json
{
  "reviews": [
    {
      "id": "rev_123",
      "product_id": "prod_123",
      "variant_id": "variant_456",
      "rating": 5,
      "comment": "Great!",
      "name": "Ali",
      "approved": false,
      "created_at": "2025-06-16T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

**500 Internal Server Error**

```json
{
  "message": "An error occurred while fetching reviews"
}
```

#### `POST /admin/reviews`

Manually create a review (usually for admin input/testing).

##### Request Body:

```json
{
  "product_id": "prod_123",
  "variant_id": "variant_123",
  "rating": 5,
  "comment": "Admin feedback",
  "name": "Admin"
}
```

#### Responses:

**200 OK**

```json
{
  "review": {
    "id": "rev_789",
    "product_id": "prod_123",
    "rating": 5,
    "comment": "Admin feedback",
    "name": "Admin",
    "approved": false,
    "created_at": "2025-06-16T14:00:00.000Z"
  }
}
```

**500 Internal Server Error**

```json
{
  "message": "An error occurred while creating the review"
}
```

#### `POST /admin/reviews/approve`

Approve a pending review by ID.

##### Request Body:

```json
{
  "review_id": "rev_789"
}
```

#### Responses:

**200 OK**

```json
{
  "message": "Review approved"
}
```

**404 Not Found**

```json
{
  "message": "Review not found"
}
```

**500 Internal Server Error**

```json
{
  "message": "An error occurred while approving the review"
}
```

## Configuration

You can configure the plugin options in `medusa-config.js` as needed.

Example configuration:

```js
{
  resolve: "@decorotika/medusa-plugin-product-reviews",
  options: {
    // your options here
  }
}
```

## Admin Panel Setup (Medusa Admin)

To add the review approval UI into your Medusa Admin panel:

### 1. Create a new file in your Admin panel:

`medusa-admin/src/extensions/medusa-plugin-product-reviews.ts`

```tsx
import routes from "@decorotika/medusa-plugin-product-reviews/admin";

export default routes;
```

### 2. Update your Admin panel’s extensions index:

`medusa-admin/src/extensions/index.ts`

```ts
import productReviewRoutes from "./medusa-plugin-product-reviews";

const extensions = [...productReviewRoutes];

export default extensions;
```

### 3. Restart your Admin Panel to see the new `/a/product-reviews` page.

## License

MIT License. See [LICENSE](LICENSE) for more details.

---

💡 **Bonus Tip**:  
Install the plugin via `yarn` or `npm`:

```bash
yarn add @decorotika/medusa-plugin-product-reviews
```

And configure the backend part in `medusa-config.js` as shown above.

---

If you need any further help or have questions, feel free to ask! 🚀

```

```
