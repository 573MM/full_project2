import { useState } from 'react';
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import axios from 'axios';
// import commonPasswordsData from './commonPasswords.json';
const commonPasswordsData = require('./commonPasswords.json');

function Signup() {
	const googleAuth = () => {
        sessionStorage.setItem('action', 'signup');
		window.open(
			`${process.env.REACT_APP_API_URL}/auth/google/callback`,
			"_self"
		);
	};
    const [formData, setFormData] = useState({
        custname: '',
        username: '',
        password: '',
        sex: '',
        address: '',
        tel: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // const handleUserName = (e) => {
    //     const username  = e.target.value;
    //     if(!ValidUsername(username)){
    //         console.log("usernameที่ปลอดภัย")
    //     }
    //     else{
    //         console.log("usernameที่ปลอดภัย")
    //     }
    // }

    const ValidUsername = (username) => {
        // ตรวจสอบความยาว
        if (username.length < 8) {
            return false;
        }
    
        if (username === "admin" || username === "root") {
            return false;
        }
        return true;
    };

    // const handlePassword = (e) => {
    //     const password = e.target.value;

    //     if(!ValidPassword(password)){
    //         alert("โปรดตั้งรหัสผ่านที่ปลอดภัยกว่านี้")
    //     }
    //     else{
    //         alert("สามารถใช้รหัสผ่านได้")
            
    //     }
    // }
    
    const ValidPassword = (password) =>{
        if(password.length < 8 || password.length > 72){
            return false
        }

        const Lower = /[a-z]/.test(password);
        const Upper = /[A-Z]/.test(password);
        const Number = /\d/.test(password);
        const Symbol = /[.,?!@#\$%^&*()\-_=+\|]/.test(password);
        if (!Lower || !Upper || !Number || !Symbol) {
            return false;
        }

        // const commonPasswords = commonPasswordsData.commonPasswords;
        // if (commonPasswords.includes(password)) {
        //     console.log("มีคำอยู่")
        //     return false;
        // }

        return true

    }

    const signup_insert = () => {
        const {username , password} = formData;
        if(!ValidUsername(username)){
            alert("โปรดตั้ง username ที่ปลอดภัยกว่านี้");

        }else if(!ValidPassword(password)){
            alert("โปรดตั้งรหัสผ่านที่ปลอดภัยกว่านี้");
        }else{
            axios.post('http://localhost:8080/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                alert('Registration successful');
                window.open(`http://localhost:3000/login`, "_self");
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to register');
            });
        }
       
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Sign up Form</h1>
            <div className={styles.form_container}>
                <div className={styles.left}>
                    <img className={styles.img} src="./images/signup.jpg" alt="signup" />
                </div>
                <div className={styles.right}>
                    <h2 className={styles.from_heading}>Create Account</h2>
                    <input type="text" name="custname" className={styles.input} placeholder="CustName" onChange={handleChange} />
                    <input type="text" name="username" className={styles.input} placeholder="Username" onChange={handleChange} />
                    <input type="password" name="password" className={styles.input} placeholder="Password" onChange={handleChange} />
                    <input type="text" name="sex" className={styles.input} placeholder="Sex" onChange={handleChange} />
                    <input type="text" name="address" className={styles.input} placeholder="Address" onChange={handleChange} />
                    <input type="text" name="tel" className={styles.input} placeholder="Tel" onChange={handleChange} />
                    <input type="text" name="email" className={styles.input} placeholder="Email" onChange={handleChange} />
                    <button className={styles.btn} onClick={signup_insert}>Sign Up</button>

                    <p className={styles.text}>or</p>
                    <button className={styles.google_btn} onClick={googleAuth}>
                        <img src="./images/google.png" alt="google icon" />
                        <span>Sing up with Google</span>
                    </button>
                    <p className={styles.text}>
                        Already Have Account ? <Link to="/login">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;