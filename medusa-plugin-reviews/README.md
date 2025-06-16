# Medusa Product Review Plugin

A plugin for [Medusa](https://medusajs.com/) that enables product reviews in your e-commerce store.

## Features

- Customers can leave reviews on products
- Admins can moderate, approve, or delete reviews
- Ratings and comments support
- Aggregate product ratings

## Installation

```bash
npm install medusa-plugin-reviews
```

Add the plugin to your `medusa-config.js`:

```js
const plugins = [
  // ...other plugins
  {
    resolve: "medusa-plugin-reviews",
    options: {
      // plugin options here
    },
  },
];
```

## Usage

- Customers can submit reviews via the storefront or API.
- Admins manage reviews in the Medusa admin dashboard.

## API Endpoints

- `POST /store/reviews` - Submit a review
- `GET /store/products/:id/reviews` - Get reviews for a product
- `GET /admin/reviews` - List all reviews (admin)
- `PATCH /admin/reviews/:id` - Update review status (admin)

## Configuration

Configure options in your `medusa-config.js` as needed.

## License

MIT
