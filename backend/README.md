# Micheludas Backend

This is the backend part of the Micheludas project, built using Node.js and Express. The backend is responsible for handling API requests, managing data, and connecting to the database.

## Project Structure

- **src/**: Contains the source code for the backend application.
  - **app.js**: Entry point of the application, initializes the Express app and sets up middleware and routes.
  - **config/**: Contains configuration files.
    - **database.js**: Database connection configuration.
  - **controllers/**: Contains the logic for handling requests.
    - **orderController.js**: Handles order-related requests.
    - **productController.js**: Handles product-related requests.
    - **tableController.js**: Handles table-related requests.
  - **models/**: Contains the data models.
    - **Order.js**: Defines the Order model.
    - **Product.js**: Defines the Product model.
    - **Table.js**: Defines the Table model.
  - **routes/**: Contains route definitions.
    - **orderRoutes.js**: Routes for order-related operations.
    - **productRoutes.js**: Routes for product-related operations.
    - **tableRoutes.js**: Routes for table-related operations.
  - **middleware/**: Contains middleware functions.
    - **errorHandler.js**: Middleware for handling errors.

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/Taborda18/MicheludasV1.git
   ```

2. Navigate to the backend directory:
   ```
   cd MicheludasV1/backend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the server:
   ```
   npm start
   ```

## API Documentation

Refer to the individual route files for details on the available API endpoints and their usage.

## License

This project is licensed under the ISC License.