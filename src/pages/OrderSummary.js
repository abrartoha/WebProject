import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, IconButton } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, Delete } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

const CartPage = () => {
  const { cartId } = useParams();
  const [fetchedCartItems, setFetchedCartItems] = useState([]);

  const increaseQuantity = (productId) => {
    setFetchedCartItems((prevItems) =>
      prevItems.map((item) => (item.Product_ID === productId ? { ...item, Quantity: item.Quantity + 1 } : item))
    );
  };

  const decreaseQuantity = (productId) => {
    setFetchedCartItems((prevItems) =>
      prevItems.map((item) =>
        item.Product_ID === productId
          ? item.Quantity > 1
            ? { ...item, Quantity: item.Quantity - 1 }
            : null // Remove the item from the cart
          : item
      ).filter((item) => item !== null)
    );
  };

  const removeItem = async (productId) => {
    try {
      const cartId = await getIncompleteCartId();
      if (cartId) {
        const response = await fetch(`http://localhost:8080/Cart_Items/${cartId}/${productId}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error(`Network response was not ok (Status: ${response.status})`);
        }
  
        // Update the front-end state to reflect the removal of the item
        setFetchedCartItems((prevItems) => prevItems.filter((item) => item.Product_ID !== productId));
      }
    } catch (error) {
      console.error('Error removing item:', error);
      // You may want to display an error message to the user if the delete request fails
    }
  };
  

  const clearCart = () => {
    setFetchedCartItems([]);
  };

  const calculateTotalPrice = () => {
    return fetchedCartItems.reduce((total, item) => total + parseFloat(item.Price) * item.Quantity, 0).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    try {
      const cartId = await getIncompleteCartId();
  
      if (fetchedCartItems.some((item) => item.Quantity === 0) || fetchedCartItems.length === 0) {
        // If the cart is empty or contains items with a quantity of 0, display an error message.
        toast.error('Sorry, please add item(s) to the cart before placing an order.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Calculate the total price of the order
        const totalPrice = calculateTotalPrice();
  
        // Create the order data
        const orderData = {
          Cart_ID: cartId,
          Order_DateTime: new Date().toISOString().slice(0, 19).replace('T', ' '), // Current date and time
          Order_Status: 'pending',
          Total_Price: totalPrice, // Add total price to the order data
        };
  
        // Make a POST request to create the order
        const orderResponse = await fetch('http://localhost:8080/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
  
        if (!orderResponse.ok) {
          throw new Error(`Error creating order (Status: ${orderResponse.status})`);
        }
  
        // Clear the cart on the front end
        clearCart();
  
        // Show a success toast message
        toast.success('Congratulations!! Your order has been placed.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
  
        // Update the cart status to "complete"
        const updateCartResponse = await fetch(`http://localhost:8080/Shopping_Cart/${cartId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Status: 'complete', Total: totalPrice.toString()}),
        });
  
        if (!updateCartResponse.ok) {
          throw new Error(`Error updating cart status (Status: ${updateCartResponse.status})`);
        }
  
        // Create a new cart with status "incomplete" and user ID 1
        const newCartData = {
          User_ID:1,
          Status:'Incomplete',
        };
  
        const createNewCartResponse = await fetch('http://localhost:8080/Shopping_Cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCartData),
        });
  
        if (!createNewCartResponse.ok) {
          throw new Error(`Error creating a new cart (Status: ${createNewCartResponse.status})`);
        }
  
        // Additional logic after placing the order
        // Replace the following line with your desired logic:
        // history.push('/order-confirmation'); // You need to import 'history' from react-router-dom
      }
    } catch (error) {
      console.error('Error placing the order:', error);
      // Handle any errors that occur when trying to place the order or make the POST requests
    }
  };
  
  
  

useEffect(() => {
  const fetchCartItems = async () => {
    try {
      const cartId = await getIncompleteCartId();

      if (cartId) {
        const response = await fetch(`http://localhost:8080/Cart_Items/${cartId}`);
        
        if (!response.ok) {
          throw new Error(`Network response was not ok (Status: ${response.status})`);
        }

        const data = await response.json();

        const mergedCartItems = data.reduce((mergedItems, currentItem) => {
          const existingItem = mergedItems.find(item => item.Product_ID === currentItem.Product_ID);
          if (existingItem) {
            existingItem.Quantity += currentItem.Quantity; // Merge quantities
          } else {
            mergedItems.push({ ...currentItem }); // Add a copy of the current item
          }
          return mergedItems;
        }, []);

        const productDetails = [];

        for (const item of data) {
          const productResponse = await fetch(`http://localhost:8080/productid/${item.Product_ID}`);
          if (!productResponse.ok) {
            throw new Error(`Failed to fetch product details (Product_ID: ${item.Product_ID})`);
          }
          const productData = await productResponse.json();
          // Push the product data to the productDetails array
          productDetails.push(productData);
        }

        const productDetailsWithQuantity = productDetails.map((product) => {
          // Find the corresponding item in mergedCartItems based on Product_ID
          const mergedItem = mergedCartItems.find((item) => item.Product_ID === product.Product_ID);
          if (mergedItem) {
            // Add the Quantity from mergedCartItems to the product
            return {
              ...product,
              Quantity: mergedItem.Quantity,
            };
          }
          return product; // If no matching item is found in mergedCartItems, return the product details as is
        });

        const uniqueProductDetailsWithQuantity = Array.from(new Set(productDetailsWithQuantity.map(JSON.stringify))).map(JSON.parse);

        setFetchedCartItems(uniqueProductDetailsWithQuantity);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setFetchedCartItems([]);
    }
  };

  fetchCartItems();
}, [cartId]);


  const getIncompleteCartId = async () => {
    try {
      const response = await fetch('http://localhost:8080/Shopping_Cart');
      if (!response.ok) {
        throw new Error(`Failed to fetch shopping cart data (Status: ${response.status})`);
      }
  
      const cartData = await response.json();
  
      // Find the first cart with status "Incomplete"
      const incompleteCart = cartData.find((cart) => cart.Status === 'Incomplete');
  
      if (incompleteCart) {
        return incompleteCart.Cart_ID;
      } else {
        // Handle the case where no incomplete cart is found
        throw new Error('No incomplete cart found');
      }
    } catch (error) {
      console.error('Error fetching incomplete cart:', error);
      return null;
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
        Your Cart
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {fetchedCartItems.length === 0 ? (
            <p>No items in the cart.</p>
          ) : (
            <ul>
              {fetchedCartItems.map((product) => (
                <Paper key={product.Product_ID} elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => removeItem(product.Product_ID)}>
                    <Delete />
                  </IconButton>
                  <div sx={{ width: 60, height: 50, overflow: 'hidden', marginRight: 16 }}>
                    <img src={product.Product_Images} alt={product.Product_Name} style={{ width: 60, height: 50, objectFit: 'cover' }} />
                  </div>
                  <Typography>{product.Product_Name}</Typography>
                  <IconButton onClick={() => decreaseQuantity(product.Product_ID)}>
                    <RemoveCircleOutline />
                  </IconButton>
                  <Typography>{product.Quantity}</Typography>
                  <IconButton onClick={() => increaseQuantity(product.Product_ID)}>
                    <AddCircleOutline />
                  </IconButton>
                </Paper>
              ))}
            </ul>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Order Summary</Typography>
            <Typography variant="body1">Total items: {fetchedCartItems.reduce((total, item) => total + item.Quantity, 0)}</Typography>
            <Typography variant="body1">Total price: ${calculateTotalPrice()}</Typography>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handlePlaceOrder}>
              Place Order
            </Button>
            <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={clearCart}>
              Clear Cart
            </Button>
          </Paper>
        </Grid>
      </Grid>
      {/* Add the ToastContainer to render toast messages */}
      <ToastContainer />
    </Container>
  );
};

export default CartPage;
