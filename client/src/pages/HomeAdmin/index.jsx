import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 

import './index.css';
import './navbar.css';

const HomeAdmin = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [navbarVisible, setNavbarVisible] = useState(true); // เพิ่ม state เก็บค่าการแสดง Navbar
  const [token, setToken] = useState(sessionStorage.getItem('token'));

    const protect = async () => {
      axios.get('http://localhost:8080/protected',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
			})
			.then(respond  => {
				//alert('login successful');
				const responseData = respond .data;
				const roledata = responseData.role;
        if(roledata !== "admin"){
          Logout();
        }
			})
			.catch(error => {
				console.error('Error:', error);
			});
    };


  useEffect(() => {
    // อ่านค่า state จาก localStorage เมื่อ component mount
    protect();
    const isNavbarVisible = localStorage.getItem('navbarVisible');
    if (isNavbarVisible === 'false') {
      setNavbarVisible(false);
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:8080/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  

  // เก็บค่า state ของ Navbar ลงใน localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('navbarVisible', navbarVisible);
  }, [navbarVisible]);

  const toggleNavbar = () => {
    setNavbarVisible(!navbarVisible);
  };

  const Logout = () => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      sessionStorage.removeItem('token');
      localStorage.removeItem('navbarVisible');
      //navigate('/login');
      const callbackUrl = `${process.env.REACT_APP_API_URL}/auth/logout`;
      window.location.href = callbackUrl;
      //window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
    };
  
    return (
      <div className="user-profile">
        <img src="img/profilephoto.png" alt="Profile" />
        <div className="dropdown-content">
          <a href="#" onClick={handleLogout}>ออกจากระบบ</a>
        </div>
      </div>
    );
  };
 

  const handleSearch = async (event) => {
    event.preventDefault(); // ป้องกันการโหลดหน้าเว็บใหม่หลังจากการส่งฟอร์ม
    const formData = new FormData(event.target); // เก็บข้อมูลจากฟอร์ม
    const searchKeyword = formData.get('search'); // ดึงข้อมูลที่ชื่อ 'search' จากฟอร์ม
  
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(`http://localhost:8080/products?keyword=${searchKeyword}`);

      const filteredProducts = response.data.filter(product => product.ProductName.includes(searchKeyword) || product.PricePerUnit == parseFloat(searchKeyword) || product.Category.includes(searchKeyword));
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProducts = () => {
    if (isLoading) {
      return <p>Loading products...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    if (!products.length) {
      return <p>No products found.</p>;
    }

    return (
      <>
        {navbarVisible && (
          <div className="container1">
            <nav className="navbar">
              <div className="logo">
                <Link to="/homeadmin">
                  <img src="img/Logo.png" alt="Logo" />
                </Link>
              </div>
              <div className="element-right">
                <form method="post"  className="search-bar" onSubmit={handleSearch}>
                  <input type="text" name="search" placeholder="Search..." />
                  <button type="submit">Search</button>
                </form>
                <Logout/>
              </div>
            </nav>

            <div className="item">
              {products.map((product) => (
                <div key={product.ProductNo} className="item_box">
                  {/* <a href={`product_item.html?productNo=${product.ProductNo}`}> */}
                  {/* <a href="#" onClick={() => product_item(product.ProductNo)}> */}
                    {/* <img src={`img/${product.ProductNo}.jpg`} alt={product.ProductName} /> */}
                    {/* <a href={`/ProductItem/${product.ProductNo}`}>
                      <img src={`img/${product.ProductNo}.jpg`} alt={product.ProductName} />
                    </a>
                  </a> */}
                  <Link to={`/updateproduct?productNo=${product.ProductNo}`}>
                    <img src={`img/${product.ProductNo}.jpg`} alt={product.ProductName} />
                  </Link>
                  <div className="info">
                    <p className="name_product">{product.ProductName}</p>
                    <div className="category">
                      <p>{product.Category}</p>
                    </div>
                    <div className="price">
                      <p>{`${product.PricePerUnit} บาท`}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> 
        )}
      </>
    );
  };

  return <>{renderProducts()}</>;
};

export default HomeAdmin;
