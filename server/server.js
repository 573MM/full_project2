require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const session = require('express-session');
const passportStrategy = require("./passport");
const app = express();

const index = require('./index'); // เรียกใช้ Router ที่เราสร้างขึ้น

// app.use(
// 	cookieSession({
// 		name: "session",
// 		keys: ["cyberwolve"],
// 		maxAge: 24 * 60 * 60 * 100,
// 	})
// );
app.use(session({
	secret: process.env.SECRET_KEY, // Replace with a strong secret key
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false } // Set to true if using https
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: ["http://localhost:3000", "http://localhost:3001"],
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use("/auth", authRoute);

app.use(index); // เรียกใช้ Router ที่เราสร้างขึ้น

// const insertToCartRouter = require('./index');
// app.use('/index', insertToCartRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
