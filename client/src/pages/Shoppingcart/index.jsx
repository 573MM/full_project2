import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './table.css'
import './navbar.css'; 
import './index.css'; 

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    const fetchCartItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:8080/shoppingcart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Failed to load cart items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);
  

  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo">
          <Link to="/product">
            <img src="img/Logo.png" alt="Logo" />
          </Link>
        </div>
        <div className="element-right">
           
          <div className="cart">
              <Link to="/shoppingcart">
                  <img src="img/cart.png" alt="Cart" />
              </Link>
          </div>
          <div className="user-profile">
              <img src="img/profilephoto.png" alt="Profile" />
              <p>{/* ที่นี่คุณอาจจะใส่ชื่อผู้ใช้ */}</p>
              <div className="dropdown-content">
                  <a href="#">การซื้อของฉัน</a>
                  <a href="logout.html?logout">ออกจากระบบ</a>
              </div>
          </div>
        </div>
      </nav>
      <div className="container_product2">
        <h2>Shopping Cart</h2>
        {isLoading ? (
          <p>Loading cart items...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : cartItems.length === 0 ? (
          <p>No items in the cart.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product No</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.CartId}>
                  <td>{item.ProductNo}</td>
                  <td>{item.ProductName}</td>
                  <td>{item.PricePerUnit}</td>
                  <td>{item.ProductQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;