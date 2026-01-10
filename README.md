# Micheludas Project

## Overview
Micheludas is a full-stack application designed for managing a bar. It consists of a React frontend and an Express backend, allowing users to manage orders, products, and tables efficiently.

## Project Structure
```
MicheludasV1
├── backend
│   ├── src
│   │   ├── app.js
│   │   ├── config
│   │   │   └── database.js
│   │   ├── controllers
│   │   │   ├── orderController.js
│   │   │   ├── productController.js
│   │   │   └── tableController.js
│   │   ├── models
│   │   │   ├── Order.js
│   │   │   ├── Product.js
│   │   │   └── Table.js
│   │   ├── routes
│   │   │   ├── orderRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── tableRoutes.js
│   │   └── middleware
│   │       └── errorHandler.js
│   ├── package.json
│   └── README.md
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   ├── components
│   │   │   ├── Menu.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Tables.jsx
│   │   ├── pages
│   │   │   ├── Dashboard.jsx
│   │   │   └── OrderManagement.jsx
│   │   └── services
│   │       └── api.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Getting Started

### Prerequisites
- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Taborda18/MicheludasV1.git
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd MicheludasV1/backend
   npm install
   ```

3. Navigate to the frontend directory and install dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd MicheludasV1/backend
   node src/app.js
   ```

2. Start the frontend application:
   ```
   cd ../frontend
   npm start
   ```

### Features
- Manage orders, products, and tables through a user-friendly interface.
- Real-time updates and interactions between the frontend and backend.

### Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

### License
This project is licensed under the ISC License.