import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import { useParams } from 'react-router-dom';
import './product_item.css'; // นำเข้าไฟล์ CSS ของ product item
import './navbar.css'; // นำเข้าไฟล์ CSS ของ navbar

const ProductItem = () => {
const { productNo } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const token = sessionStorage.getItem('token');
  const [navbarVisible, setNavbarVisible] = useState(true); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productNo = urlParams.get('productNo');

    axios.get(`http://localhost:8080/product_item?productNo=${productNo}`)
      .then(response => {
        const fetchedProduct = response.data[0];
        setProduct(fetchedProduct);
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });
  }, []);

  const handleMinus = () => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity - 1));
  };

  const handlePlus = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const buyNow = () => {
    window.location.assign('shopping_cart2.html');
  };

  const addToCart = () => {
    axios.post('http://localhost:8080/insert_to_cart', {
      productNo: product.ProductNo,
      quantity: quantity
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log(productNo , quantity);
      alert('Product added to cart');
      
      window.location.assign('/shoppingcart');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to add product to cart');
    });
  };

 
  
  
  return (
    <>
      {navbarVisible && (
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
          <div className="container_product">
            <div className="product_img">
              <img src={`img/${product.ProductNo}.jpg`} alt={product.ProductName} />
            </div>
            <div className="inform">
              <p className="Item_name">{product.ProductName}</p>
              <p className="price">{`${product.PricePerUnit} บาท`}</p>
              <p className="Item_description">{product.Description}</p>
              <div className="product_qty">
                <button className="quantity-btn minus-btn" onClick={handleMinus}>-</button>
                <input type="text" className="quantity-input" placeholder="จำนวนสินค้า" value={quantity} />
                <button className="quantity-btn plus-btn" onClick={handlePlus}>+</button>
              </div>
              <button className="buy_now" onClick={buyNow}>ซื้อสินค้า</button>
              <button className="add_to_cart" onClick={addToCart}>เพิ่มลงตะกร้า</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
  
};

export default ProductItem;