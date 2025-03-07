import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import { useParams } from 'react-router-dom';
import './index.css'; // นำเข้าไฟล์ CSS ของ product item
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
        console.log(formData);
        setProduct(fetchedProduct);
        setFormData({productNo :fetchedProduct.ProductNo,
            productName : fetchedProduct.ProductName,
            pricePerUnit: fetchedProduct.PricePerUnit,
            cost: fetchedProduct.Cost,
            qty: fetchedProduct.Qty,
            category: fetchedProduct.Category});
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });
  }, []);





  const [formData , setFormData] = useState({
    productNo :'',
    productName : '',
    pricePerUnit: '',
    cost: '',
    qty: '',
    category: ''

  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
    }));
    console.log(formData);
};

  
  const updateProduct = (e) =>{
    axios.post('http://localhost:8080/update_product', formData, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      //console.log(productNo , quantity,productName);
      alert('Update Product Success');
      //window.location.assign('/updateProduct');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to Update Product');
    });
  }

 
  
  
  return (
    <>
      {navbarVisible && (
        <div className="container">
          <nav className="navbar">
            <div className="logo">
              <Link to="/homeadmin">
                <img src="img/Logo.png" alt="Logo" />
              </Link>
            </div>
            <div className="element-right">
                <div className="user-profile">
                  <img src="img/profilephoto.png" alt="Profile" />
                  <p>{/* ที่นี่คุณอาจจะใส่ชื่อผู้ใช้ */}</p>
                  <div className="dropdown-content">
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
                <p>ชื่อสินค้า</p>
                <input type='text' name='productName'  value={formData.productName} onChange={handleChange}></input>
                <p>ราคาต่อหน่วย</p>
                <input type="text" name="pricePerUnit"  value={formData.pricePerUnit} onChange={handleChange}></input>
                <p>ราคาทุน</p>
                <input type='text'  name="cost"  value={formData.cost} onChange={handleChange}></input>
                <p>จำนวนคงคลัง</p>
                <input type='text'  name="qty"  value={formData.qty} onChange={handleChange}></input>
                <p>ประเภทสินค้า</p>
                <input type='text' name='category'  value={formData.category} onChange={handleChange}></input>
                <br></br>
                <button onClick={updateProduct}>Update</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
  
};

export default ProductItem;