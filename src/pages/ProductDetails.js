import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

async function fetchProductDetails(productName) {
  try {
    const encodedProductName = encodeURIComponent(productName);
    const response = await fetch(`http://localhost:8080/products/${encodedProductName}`);

    if (!response.ok) {
      throw new Error(`Network response was not ok (Status: ${response.status})`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

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

const ProductDetails = () => {
  const { productName } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isRemovingFromCart, setIsRemovingFromCart] = useState(false);

  useEffect(() => {
    fetchProductDetails(productName)
      .then((data) => {
        setProductDetails(data);
      })
      .catch((error) => {
        console.error('Error fetching product details', error);
      });
  }, [productName]);

  const handleRemoveFromCart = async () => {
    if (!productDetails || isRemovingFromCart) {
      return;
    }

    setIsRemovingFromCart(true);

    try {
      const cartId = await getIncompleteCartId();

      if (cartId) {
        const response = await fetch(`http://localhost:8080/Cart_Items/${cartId}/${productDetails.Product_ID}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log('Item removed from cart successfully');
          // You may want to update the cart state or display a success message here
        } else {
          console.error('Error removing item from cart');
          // Handle errors, e.g., display an error message
        }
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      // Handle network errors, if any
    } finally {
      setIsRemovingFromCart(false);
    }
  };

  const handleAddToCart = async () => {
    if (!productDetails || isAddingToCart) {
      return;
    }

    setIsAddingToCart(true);

    try {
      const cartId = await getIncompleteCartId();

      if (cartId) {
        const response = await fetch(`http://localhost:8080/Cart_Items/${cartId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: productDetails.Product_ID,
            quantity: 1,
          }),
        });

        if (response.ok) {
          console.log('Item added to cart successfully');
          // You may want to update the cart state or display a success message here
        } else {
          console.error('Error adding item to cart');
          // Handle errors, e.g., display an error message
        }
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Handle network errors, if any
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details">
      <div className="product-image">
        <img src={productDetails.Product_Images} alt={productDetails.Product_Name} />
      </div>
      <div className="product-info">
        <h2>{productDetails.Product_Name}</h2>
        {/* ... (other product details) */}
        {isAddingToCart ? (
          <div>Adding to Cart...</div>
        ) : (
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        )}
        {isRemovingFromCart ? (
          <div>Removing from Cart...</div>
        ) : (
          <button className="remove-from-cart-button" onClick={handleRemoveFromCart}>
            Remove from Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
