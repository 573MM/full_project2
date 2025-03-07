// insert_to_cart.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql');


require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const host = process.env.DB_HOST;
const user = process.env.USER;
const passWord = process.env.PASSWORD;
const dataBase = process.env.DB_NAME;
// เชื่อมต่อกับ MySQL Database
const connection = mysql.createConnection({
  host: host,
  user: user, 
  password: passWord, 
  database: dataBase,
});
const jwt = require('jsonwebtoken');



// เมื่อมีการ POST ข้อมูลสินค้าที่จะเพิ่มลงในตะกร้า
router.post('/', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  // ดึงค่า CustNo จาก JWT
  const decodedToken = jwt.verify(token, secretKey);
  const custNo = decodedToken.CustNo;
  
  const productNo = req.body.productNo;
  const quantity = parseInt(req.body.quantity, 10);
  console.log(custNo , productNo, quantity);
  // ตรวจสอบว่าสินค้ามีอยู่ในตะกร้าแล้วหรือไม่
  const query = "SELECT * FROM shoppingcart WHERE CustNo = ? AND ProductNo = ?";
  connection.query(query, [custNo, productNo], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    
    if (result.length > 0) {
      // ถ้ามีสินค้าอยู่ในตะกร้าแล้ว ให้อัปเดตจำนวนสินค้า
      const row = result[0];
      const cartId = row.CartId;
      const currentQuantity = parseInt(row.ProductQty,10);
      const newQuantity = currentQuantity + quantity;

      const updateQuery = "UPDATE shoppingcart SET ProductQty = ? WHERE CartId = ?";
      connection.query(updateQuery, [newQuantity, cartId], (updateErr, updateResult) => {
        if (updateErr) {
          return res.status(500).json({ message: "Failed to update product quantity in cart" });
        }
        return res.status(200).json({ message: "Product quantity updated in cart" });
      });
    } else {
      // ถ้ายังไม่มีสินค้าในตะกร้า ให้เพิ่มสินค้าเข้าไปใหม่
      const insertQuery = "INSERT INTO shoppingcart (CustNo, ProductNo, ProductQty) VALUES (?, ?, ?)";
      connection.query(insertQuery, [custNo, productNo, quantity], (insertErr, insertResult) => {
        if (insertErr) {
          return res.status(500).json({ message: "Failed to add product to cart" });
        }
        return res.status(200).json({ message: "Product added to cart" });
      });
    }
  });
});

module.exports = router;