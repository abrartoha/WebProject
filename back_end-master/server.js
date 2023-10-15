const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const { Web3 } = require('web3');


const web3 = new Web3('HTTP://127.0.0.1:7545'); // Change the URL as per your blockchain setup
const contractAddress = '0x5467f5F6cE7F540B01361fB228B171743D0dC15f'; // Replace with the deployed contract address
const accountaddress = '0x1dcAa4Ae4114e137e14de4082963799eDf7Ec5dD'; // Replace with the account address
const abi = require('./MyContractAbi.json');


const app = express();
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mdtoh@575000', // Change to your database password
  database: 'mydb', // Change to your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your front-end's origin
}));

app.get('/products', (req, res) => {
  // Query your MySQL database to retrieve product data here
  pool.query('SELECT * FROM Product_Catalog', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving products');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(results);
    }
  });
});

// Get product details by product name
app.get('/products/:product_name', (req, res) => {
  const productName = req.params.product_name;

  // Query your MySQL database to retrieve product details by product name
  pool.query('SELECT * FROM Product_Catalog WHERE Product_Name = ?', [productName], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving product details');
    } else if (results.length === 0) {
      // Handle the case where the product is not found
      res.status(404).send('Product not found');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(results[0]); // Assuming the query returns a single product
    }
  });
});

app.get('/productid/:product_ID', (req, res) => {
  const productID = req.params.product_ID;

  // Query your MySQL database to retrieve product details by product name
  pool.query('SELECT * FROM Product_Catalog WHERE Product_ID = ?', [[productID]], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving product details');
    } else if (results.length === 0) {
      // Handle the case where the product is not found
      res.status(404).send('Product not found');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(results[0]); // Assuming the query returns a single product
    }
  });
});

// Create a new shopping cart
app.post('/Shopping_Cart', (req, res) => {
  // You can include additional logic here, such as setting cart details.
  // For simplicity, this example inserts a new cart with User_ID = 1 and Status = 'Incomplete'.
  pool.query('INSERT INTO Shopping_Cart (User_ID, Cart_DateTime, Status, Total) VALUES (?, NOW(), ?, ?)', [1, 'Incomplete', 0], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating shopping cart');
    } else {
      res.status(201).send('Shopping cart created successfully');
    }
  });
});


app.get('/Shopping_Cart', (req, res) => {
  // Define the SQL query to fetch shopping cart data
  const query = 'SELECT * FROM Shopping_Cart';

  // Execute the query
  pool.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving shopping cart data');
    } else {
      res.json(results);
    }
  });
});

// Get cart items for a specific shopping cart
app.get('/Shopping_Cart/:Cart_ID', (req, res) => {
  const Cart_ID = req.params.Cart_ID;
  pool.query('SELECT * FROM Shopping_Cart WHERE Cart_ID = ?', [Cart_ID], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving cart items');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(results);
    }
  });
});



// Get cart items for a specific shopping cart
app.get('/Cart_Items/:cart_id', (req, res) => {
  const cartId = req.params.cart_id;
  pool.query('SELECT * FROM Cart_Items WHERE Cart_ID = ?', [cartId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving cart items');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(results);
    }
  });
});

// Add a new item to a shopping cart
app.post('/Cart_Items/:cart_id', (req, res) => {
  const cartId = req.params.cart_id;
  const { product_id, quantity } = req.body;

  // You can include additional logic here, such as checking product availability and updating cart total.
  // For simplicity, this example just inserts a new cart item.
  pool.query('INSERT INTO Cart_Items (Cart_ID, Product_ID, Quantity) VALUES (?, ?, ?)', [cartId, product_id, quantity], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding item to cart');
    } else {
      res.status(201).send('Item added to cart successfully');
    }
  });
});

app.post('/orders', (req, res) => {
  // Extract order data from the request body
  const { Cart_ID, Order_DateTime, Order_Status } = req.body;

  // Insert the new order into the Orders table
  const insertQuery = 'INSERT INTO Orders (Cart_ID, Order_DateTime, Order_Status) VALUES (?, ?, ?)';
  pool.query(insertQuery, [Cart_ID, Order_DateTime, Order_Status], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating order');
    } else {
      res.status(201).send('Order created successfully');
    }
  });
});

// Retrieve all orders
app.get('/orders', (req, res) => {
  // Fetch all orders from the Orders table
  const selectQuery = 'SELECT * FROM Orders';
  pool.query(selectQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving orders');
    } else {
      res.json(results);
    }
  });
});

app.put('/Shopping_Cart/:cart_id', (req, res) => {
  const cartId = req.params.cart_id;
  const { Status, Total } = req.body; // Accept 'Status' in the request body

  // Update the cart status in your database
  pool.query('UPDATE Shopping_Cart SET Status = ?, Total = ? WHERE Cart_ID = ?', [Status, Total, cartId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating cart status');
    } else {
      res.status(200).send('Cart status updated successfully');
    }
  });
});

app.delete('/Cart_Items/:cart_id/:product_id', (req, res) => {
  const cartId = req.params.cart_id;
  const productId = req.params.product_id;

  pool.query(
    'DELETE FROM Cart_Items WHERE Cart_ID = ? AND Product_ID = ?',
    [cartId, productId],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error removing item from cart');
      } else {
        res.status(200).send('Item removed from cart successfully');
      }
    }
  );
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
