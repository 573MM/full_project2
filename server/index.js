
const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());

router.use(express.static('public'));
router.use(express.json());
router.use(express.urlencoded({extended : true}));
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const host = process.env.DB_HOST;
const user = process.env.USER;
const passWord = process.env.PASSWORD;
const dataBase = process.env.DB_NAME;



//app.listen(3000, () => console.log("Start service on port 3000"));
router.use(express.json())
//middleware ใน Express ที่ใช้สำหรับการแปลงข้อมูล
router.use(express.urlencoded({ extended: true }))
//nosniff' ซึ่งมีไว้เพื่อป้องกันการทำงานของการทำอ่าน (sniffing) 
// Cross-Site Scripting (XSS) คืออะไร?
//Cross-Site Scripting (XSS) เป็นช่องโหว่ด้านความปลอดภัยบนเว็บแอปพลิเคชันที่อนุญาตให้ผู้โจมตีแทรกโค้ด JavaScript ที่เป็นอันตรายลงในหน้าเว็บที่ผู้ใช้รายอื่นดูไ
router.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });


const con = mysql.createConnection({
    host: host,
    user: user, 
    password: passWord, 
    database: dataBase,
  });
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

router.post("/register", async (req, res) => {
    const {custname = null, username, password, sex = null, address = null, tel = null ,email} = req.body;
    //console.log("passWord = "+password)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    con.query("INSERT INTO customer (CustName, UserName ,Password, Sex, Address, Tel, Email) VALUES (?, ?, ?, ?, ?, ?, ?);", [custname, username, hashedPassword, sex, address, tel ,email],(error,result,fields) => {
            if(error){
                return res.status(401).json({message : "Unable to complete registration"});
            }
            //console.log("hashedPassword"+hashedPassword);
            return res.status(201).json({ message: "Register successfully" });
        }
    )
})
router.post("/register_admin", async (req, res) => {
  const {custname = null, username, password, sex = null, address = null, tel = null ,email,role} = req.body;
  //console.log("passWord = "+password)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  con.query("INSERT INTO customer (CustName, UserName ,Password, Sex, Address, Tel, Email,Role) VALUES (?, ?, ?, ?, ?, ?, ?,?);", [custname, username, hashedPassword, sex, address, tel ,email,role],(error,result,fields) => {
          if(error){
              return res.status(401).json({message : "Unable to complete registration"});
          }
          //console.log("hashedPassword"+hashedPassword);
          return res.status(201).json({ message: "Register successfully" });
      }
  )
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  con.query("SELECT CustNo, UserName, Password ,Role FROM customer WHERE UserName = ?", [username], async function (err, result, fields) {
      if (err) {
          return res.status(401).json({ message: "Can't connect to database" });
      }
      // ตรวจสอบว่ามีผู้ใช้งานที่ตรงกับชื่อผู้ใช้ที่ใส่เข้ามาหรือไม่
      if (!result[0]) {
        return res.status(400).json({ message: "Username or Password incorrect" });
    }
      // เช็ครหัสผ่านว่าตรงกับที่เก็บในฐานข้อมูลหรือไม่
      const passwordMatch = await bcrypt.compare(password, result[0].Password);
      //const passwordMatch = password === result[0].Password;
      //console.log("result"+result[0].Password);
      if (!passwordMatch) {
          return res.status(401).json({ message: "Username or Password incorrect2",test:result[0].Password ,pp:passwordMatch});
      } else {
        const tokenPayload = {
            CustNo: result[0].CustNo,
            Role: result[0].Role // เพิ่ม Role เข้าไปใน payload ของ token
        };
        const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '3h' });
        //console.log("role = " + result[0].Role);
        return res.status(200).json({ token, role: result[0].Role, message: "Login successfully" }); // ส่งค่า role กลับไปยัง frontend
        //return res.status(200).json({ token, message: "Login successfully" });
      }
  });
});
router.post("/check_user", async (req, res) => {
  const { username} = req.body;
  con.query("SELECT UserName FROM customer WHERE UserName = ?", [username], async function (err, result, fields) {
      if (err) {
          return res.status(401).json({ message: "Can't connect to database" });
      }
      // ตรวจสอบว่ามีผู้ใช้งานที่ตรงกับชื่อผู้ใช้ที่ใส่เข้ามาหรือไม่
      if (!result[0]) {
        return res.status(200).json({ message: "Have no user can signup" });
      }else{
        return res.status(400).json({error: true, message: "มีผู้ใช้อยู่แล้ว"})
      }
  });
});


router.get('/protected',async (req, res) => {
  try{
      if (!req.headers.authorization) {
        // ถ้าไม่มีการระบุให้ส่งข้อความข้อผิดพลาดกลับไป
        return res.status(401).json({
            message: 'Unauthorized - Missing authorization header'
        });
    }
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secretKey);
    const role = decoded.Role;
    res.json({
      message: 'Hello! You are authorized',
      decoded,
      role
  });
  }catch (error) {
    // กระบวนการ decode Token ไม่สำเร็จหรือ Token ไม่ถูกต้อง
    res.status(401).json({
        message: 'Unauthorized - Invalid token',
        error: error.message,
    });
}
    
    // try {
    //   const decoded = jwt.verify(token, secretKey);
    //   const role = decoded.Role;
    //       res.json({
    //           message: 'Hello! You are authorized',
    //           decoded,
    //           role // ส่งค่า role กลับไปด้วย
    //       });
    // } catch (error) {
    //     // กระบวนการตรวจสอบสิทธิ์ไม่สำเร็จ เนื่องจากข้อมูล token ไม่ถูกต้องหรือหมดอายุ
    //     res.status(401).json({
    //         message: 'Unauthorized - Invalid token',
    //         error: error.message,
    //     });
    // }
})

router.get('/products', (req, res) => {
  // ดึงข้อมูลจากฐานข้อมูล
  let query = "SELECT * FROM product ORDER BY ProductNo";
  con.query(query, (err, result) => {
    if (err) throw err;
    res.json(result); // ส่งข้อมูลเป็น JSON กลับไปยัง client
  });
});
router.get('/product_item', (req, res) => {
  const { productNo } = req.query;
  let query = "SELECT * FROM product WHERE ProductNo = ? ORDER BY ProductNo";
  con.query(query, [productNo], (err, result) => {
    if (err) throw err;
    res.json(result); // ส่งข้อมูลเป็น JSON กลับไปยัง client
  });
});

router.post('/update_product', (req, res) => {
  const { productNo ,productName,pricePerUnit,cost,qty,category} = req.body;
  con.query("UPDATE product SET ProductName = ?, PricePerUnit = ?, Cost = ?, Qty = ?, Category = ? WHERE ProductNo = ?;", [productName, pricePerUnit, cost, qty, category, productNo],(error,result,fields) => {
    if(error){
        return res.status(401).json({message : "Cant Update Product"});
    }
    return res.status(201).json({ message: "Product Update successfully" });
  })
});

const insertToCartRouter = require('./insert_to_cart');
router.use('/insert_to_cart', insertToCartRouter);


// สร้าง API สำหรับการค้นหาสินค้า
router.post('/search', (req, res) => {
  let search_input = req.body.search;
  let query = `SELECT * FROM product WHERE LOWER(ProductNo) LIKE LOWER('%${search_input}%') OR LOWER(ProductName) LIKE LOWER('%${search_input}%') OR LOWER(Category) LIKE LOWER('%${search_input}%') ORDER BY ProductNo`;
  con.query(query, (err, result) => {
    if (err) throw err;
    res.json(result); // ส่งข้อมูลเป็น JSON กลับไปยัง client
  });
});
const fs = require('fs');

router.get('/navbar', (req, res) => {
  fs.readFile('public/navbar.html', 'utf8', (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

router.get('/shoppingcart', (req,res) => {
  const token = req.headers.authorization.split(' ')[1];
  // ดึงค่า CustNo จาก JWT
  const decodedToken = jwt.verify(token, secretKey);
  const custNo = decodedToken.CustNo;
  let query = "SELECT shoppingcart.CartId, shoppingcart.ProductNo, shoppingcart.ProductQty, product.PricePerUnit ,product.ProductName FROM shoppingcart INNER JOIN product ON product.ProductNo = shoppingcart.ProductNo WHERE shoppingcart.CustNo = ? ORDER BY shoppingcart.ProductNo; ";
  con.query(query, [custNo], (err, result) => {
    if (err) throw err;
    res.json(result); // ส่งข้อมูลเป็น JSON กลับไปยัง client
  });
})


module.exports = router;


