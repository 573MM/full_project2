import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Product from "./pages/Product";
import ProductItem from "./pages/ProductItem";
import ShoppingCart from "./pages/Shoppingcart";
import HomeAdmin from "./pages/HomeAdmin";
import UpdateProduct from "./pages/UpdateProduct";


import "./App.css";

import React from 'react';


function App() {
	const [user, setUser] = useState(null);
	const getUser = async () => {
		try {
			const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
			const { data } = await axios.get(url, { withCredentials: true });
			setUser(data.user._json);
		} catch (err) {
			console.log(err);
		}
	};
	
	useEffect(() => {
		getUser();
	}, []);

	return (
		<div className="container">
			<Routes>
			
				<Route
					exact
					path="/"
					element={user ? <Home user={user} /> : <Navigate to="/login" />}
				/>
				{/* <Route
					exact
					path="/homeadmin"
					element={role === 'admin' ? <HomeAdmin user={user} /> : <Navigate to="/login" />}
				/> */}
				<Route path="/homeadmin" element={<HomeAdmin />} />
				<Route path="/updateproduct" element={<UpdateProduct />} />
				<Route
					exact
					path="/login"
					element={user ? <Navigate to="/" /> : <Login />}
				/>
				<Route
					path="/signup"
					element={user ? <Navigate to="/" /> : <Signup />}
				/>
				{/* <Route 
					path="/Home.html" 
					element={<Home user={user} />}
				/> */}
				{/* <Route
					path="/product"
					element={user ? <Navigate to="/" /> : <Product />}
				/> */}
				{/* <Route path="/product" element={<Product />} /> */}
				<Route path="/productitem" element={<ProductItem />} />
				<Route path="/shoppingcart" element={<ShoppingCart />} />
				<Route path="/product" element={<Product user={user} />} /> 
				{/* <Route
					exact
					path="/homeadmin"
					element={user && user.role === 'admin' ? <HomeAdmin user={user} /> : <Navigate to="/" />}
				/> */}
				{/* <Route
					exact
					path="/homeadmin"
					element={
						user  ? (
						<HomeAdmin user={user} />
						) : (
						<Navigate to="/" />
						)
					}
				/> */}



			</Routes>
		</div>
	);
}

export default App;